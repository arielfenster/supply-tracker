import { Database } from '$/db/db';
import {
	InviteStatus,
	NewInventory,
	UserRole,
	categories,
	inventories,
	invites,
	items,
	subcategories,
	users,
	usersToInventories,
} from '$/db/schemas';
import { UpdateUserRoleInput } from '$/schemas/inventories/update-user-role.schema';
import { and, count, eq, ne, or, sql } from 'drizzle-orm';
import { CreateInventoryPayload, ItemQuantityStatus } from '../handlers/inventories.handler';
import { generateTimestamps } from '../utils';

export async function getInventoryById(id: string, db: Database) {
	return db.query.inventories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
		with: {
			owner: {
				columns: {
					firstName: true,
					lastName: true,
					email: true,
				},
			},
			categories: {
				with: {
					subcategories: {
						with: {
							items: true,
						},
					},
				},
			},
		},
	});
}

/**
 * Returns the list of inventories the user is:
 * 1. owner of
 * 2. a strict member of (not an owner)
 */
export async function getInventoriesUserIsOwnerOrMemberOf(userId: string, db: Database) {
	return db
		.selectDistinctOn([inventories.id],{
			inventory: inventories,
			role: usersToInventories.role,
			owner: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				email: users.email,
			},
		})
		.from(usersToInventories)
			.innerJoin(users, eq(usersToInventories.userId, users.id))
			.innerJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		// .from(inventories)
		// .innerJoin(users, eq(inventories.ownerId, users.id))
		// .innerJoin(
		// 	usersToInventories,
		// 	and(
		// 		eq(usersToInventories.userId, users.id),
		// 		eq(inventories.id, usersToInventories.inventoryId),
		// 	),
		// )
		.where(
			eq(usersToInventories.userId, userId)
			// or(
			// 	eq(inventories.ownerId, userId), // User is the owner
			// 	and(eq(usersToInventories.userId, userId), ne(usersToInventories.role, UserRole.OWNER)), // User is a strict member of the inventory
			// ),
		)
		.execute();
}

/**
 * Returns a list of:
 * 1. The inventory owner
 * 2. All users that are invited/have been invited to this inventory and accepted
 */
export async function getInventoryMembers(inventoryId: string, db: Database) {
	return db
		.select({
			status: invites.status,
			role: usersToInventories.role,
			user: users,
		})
		.from(users)
		.leftJoin(invites, eq(invites.recipientId, users.id))
		.innerJoin(
			usersToInventories,
			and(eq(usersToInventories.userId, users.id), eq(usersToInventories.inventoryId, inventoryId)),
		)
		.where(
			and(
				eq(usersToInventories.inventoryId, inventoryId),
				or(eq(usersToInventories.role, UserRole.OWNER), eq(invites.status, InviteStatus.ACTIVE)),
			),
		)
		.execute();
}

export async function findUserInventoryWithSimilarName(data: CreateInventoryPayload, db: Database) {
	return db.query.inventories
		.findMany({
			where: (fields, { and, eq, ilike }) =>
				and(eq(fields.ownerId, data.ownerId), ilike(fields.name, data.name)),
		})
		.execute();
}

export async function createInventory(data: CreateInventoryPayload, db: Database) {
	const [inventory] = await db
		.insert(inventories)
		.values({
			...data,
			...generateTimestamps(),
		})
		.returning();

	return inventory;
}

export async function updateInventory(id: string, data: Partial<NewInventory>, db: Database) {
	const { updatedAt } = generateTimestamps();

	const [updated] = await db
		.update(inventories)
		.set({
			...data,
			updatedAt,
		})
		.where(eq(inventories.id, id))
		.returning();

	return updated;
}

export async function getTotalItemsCountForInventory(inventoryId: string, db: Database) {
	const query = db
		.select({ totalItems: count(items.quantity).as('totalItems') })
		.from(inventories)
		.leftJoin(categories, eq(categories.inventoryId, inventories.id))
		.leftJoin(subcategories, eq(subcategories.categoryId, categories.id))
		.leftJoin(items, eq(items.subcategoryId, subcategories.id))
		.where(eq(inventories.id, inventoryId));

	const result = await db.execute<{ totalItems: number }>(query);
	return result[0].totalItems
}

export async function getItemQuantitiesForInventory(inventoryId: string, db: Database) {
	const query = db
		.select({
			stockStatus: sql`
					CASE
						WHEN ${items.quantity} = '0' THEN ${ItemQuantityStatus.OUT_OF_STOCK}
						WHEN ${items.quantity} < '${items.dangerThreshold}' THEN ${ItemQuantityStatus.DANGER_STOCK}
						WHEN ${items.quantity} < '${items.warningThreshold}' THEN ${ItemQuantityStatus.WARNING_STOCK}
						ELSE ${ItemQuantityStatus.IN_STOCK}
					END`.as('stockStatus'),
		})
		.from(usersToInventories)
		.leftJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		.leftJoin(categories, eq(categories.inventoryId, inventories.id))
		.leftJoin(subcategories, eq(subcategories.categoryId, categories.id))
		.leftJoin(items, eq(items.subcategoryId, subcategories.id))
		.where(eq(usersToInventories.inventoryId, inventoryId));

	const result = await db.execute<{ stockStatus: ItemQuantityStatus }>(query);
	return result.reduce((acc, res) => {
		acc[res.stockStatus] = (acc[res.stockStatus] || 0) + 1;
		return acc;
	}, {} as Record<ItemQuantityStatus, number>);
}

export async function updateUserRole(data: UpdateUserRoleInput, db: Database) {
	const [updated] = await db
		.update(usersToInventories)
		.set({
			role: data.role,
		})
		.where(
			and(
				eq(usersToInventories.inventoryId, data.inventoryId),
				eq(usersToInventories.userId, data.userId),
			),
		)
		.returning();
	return updated;
}
