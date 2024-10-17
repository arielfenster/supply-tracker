import { db } from '$/db/db';
import {
	InviteStatus,
	UserRole,
	categories,
	inventories,
	invites,
	items,
	subcategories,
	users,
	usersToInventories,
} from '$/db/schemas';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';
import { and, count, eq, ne, or, sql } from 'drizzle-orm';
import { getCurrentTimestamps } from './utils';

export type UserInventory = Awaited<ReturnType<typeof getUserInventories>>[number];
export type InventoryMember = Awaited<ReturnType<typeof getInventoryMembers>>[number];

export async function getUserInventories(userId: string) {
	const data = await db.query.usersToInventories.findMany({
		where: (fields, { eq }) => eq(fields.userId, userId),
		with: {
			inventory: {
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
			},
		},
	});
	return data.map((item) => item.inventory);
}

export async function getInventoryById(id: string) {
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
 * Returns a list of:
 * 1. the inventory owner
 * 2. all users that are invited/have been invited to this inventory and haven't declined (pending users are considered members)
 */
export async function getInventoryMembers(id: string) {
	return db
		.select({
			status: invites.status,
			role: usersToInventories.role,
			user: users,
		})
		.from(users)
		.leftJoin(invites, eq(invites.recipientId, users.id))
		.leftJoin(
			usersToInventories,
			and(eq(usersToInventories.userId, users.id), eq(usersToInventories.inventoryId, id)),
		)
		.where(
			and(
				eq(usersToInventories.inventoryId, id),
				or(eq(usersToInventories.role, UserRole.OWNER), ne(invites.status, InviteStatus.DECLINED)),
			),
		)
		.execute();
}

export async function findUserInventoryWithSimilarName(data: CreateInventoryPayload) {
	return db.query.inventories
		.findMany({
			where: (fields, { and, eq, like }) =>
				and(eq(fields.ownerId, data.ownerId), like(fields.name, data.name)),
		})
		.execute();
}

export type CreateInventoryPayload = { name: string; ownerId: string };

export async function createInventory(data: CreateInventoryPayload) {
	const [inventory] = await db
		.insert(inventories)
		.values({
			...data,
			...getCurrentTimestamps(),
		})
		.returning();

	await db
		.insert(usersToInventories)
		.values({ userId: data.ownerId, inventoryId: inventory.id, role: UserRole.OWNER })
		.execute();

	return inventory;
}

export async function updateInventory(data: UpdateInventoryInput) {
	const { updatedAt } = getCurrentTimestamps();

	const [updated] = await db
		.update(inventories)
		.set({
			name: data.name,
			updatedAt,
		})
		.where(eq(inventories.id, data.id))
		.returning();

	return updated;
}

export async function getTotalItemsCountForInventory(inventoryId: string) {
	const query = db
		.select({ totalItems: count(items.quantity).as('totalItems') })
		.from(inventories)
		.leftJoin(categories, eq(categories.inventoryId, inventories.id))
		.leftJoin(subcategories, eq(subcategories.categoryId, categories.id))
		.leftJoin(items, eq(items.subcategoryId, subcategories.id))
		.where(eq(inventories.id, inventoryId));

	const result = await db.get<{ totalItems: number }>(query).execute();
	return result.totalItems;
}

export const ItemQuantityStatus = {
	IN_STOCK: 'inStock',
	WARNING_STOCK: 'warningStock',
	DANGER_STOCK: 'dangerStock',
	OUT_OF_STOCK: 'outOfStock',
} as const;

export type ItemQuantityStatus = (typeof ItemQuantityStatus)[keyof typeof ItemQuantityStatus];

export async function getItemQuantitiesForInventory(inventoryId: string) {
	const query = db
		.select({
			stockStatus: sql`
					CASE
						WHEN ${items.quantity} = 0 THEN ${ItemQuantityStatus.OUT_OF_STOCK}
						WHEN ${items.quantity} < ${items.dangerThreshold} THEN ${ItemQuantityStatus.DANGER_STOCK}
						WHEN ${items.quantity} < ${items.warningThreshold} THEN ${ItemQuantityStatus.WARNING_STOCK}
						ELSE ${ItemQuantityStatus.IN_STOCK}
					END`.as('stockStatus'),
		})
		.from(usersToInventories)
		.leftJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		.leftJoin(categories, eq(categories.inventoryId, inventories.id))
		.leftJoin(subcategories, eq(subcategories.categoryId, categories.id))
		.leftJoin(items, eq(items.subcategoryId, subcategories.id))
		.where(eq(usersToInventories.inventoryId, inventoryId));

	const result = await db.all<{ stockStatus: ItemQuantityStatus }>(query).execute();
	return result.reduce((acc, res) => {
		acc[res.stockStatus] = (acc[res.stockStatus] || 0) + 1;
		return acc;
	}, {} as Record<ItemQuantityStatus, number>);
}
