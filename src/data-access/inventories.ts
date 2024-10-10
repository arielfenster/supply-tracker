import { db } from '$/db/db';
import {
	User,
	UsersToInventories,
	categories,
	inventories,
	items,
	subcategories,
	usersToInventories,
} from '$/db/schemas';
import { and, count, eq, like, sql } from 'drizzle-orm';
import { addCurrentTimestamps } from './utils';

export type UserInventory = Awaited<ReturnType<typeof getUserInventories>>[number];
export type InventoryMembers = Awaited<ReturnType<typeof getInventoryMembers>>;

export async function getUserInventories(userId: string) {
	const data = await db.query.usersToInventories.findMany({
		where: (fields, { eq }) => eq(fields.userId, userId),
		with: {
			inventory: {
				with: {
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

export async function getInventoryMembers(id: string) {
	return db.query.invites.findMany({
		where: (fields, { eq }) => eq(fields.inventoryId, id),
		with: {},
	});
	return db.query.usersToInventories
		.findMany({
			where: (fields, { eq }) => eq(fields.inventoryId, id),
			with: {
				user: {
					columns: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
					},
				},
			},
		})
		.execute();

	// const result = {
	// 	...data,
	// 	members: data!.usersToInventories.map((userToInventory) => userToInventory.user),
	// };

	// delete result.usersToInventories;

	// return result;

	return db.query.invites.findMany({
		where: (fields, { eq }) => eq(fields.inventoryId, id),
		with: {
			inventory: { with: {} },
		},
		// with: { inventory: { with: { usersToInventories: { with: { user: true } } } } },
	});
	// return db.query.usersToInventories.findMany({
	// 	where: (fields, { eq }) => eq(fields.inventoryId, id),
	// 	with: {
	// 		user: true,
	// 	},
	// });
}

export async function createInventory(data: { name: string; userId: string }) {
	const existingUserInventoriesWithSameName = await db
		.select()
		.from(usersToInventories)
		.leftJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		.where(and(eq(usersToInventories.userId, data.userId), like(inventories.name, data.name)))
		.execute();

	if (existingUserInventoriesWithSameName.length) {
		throw new Error(`Inventory ${data.name} already exists`);
	}

	const payloadWithTimestamps = addCurrentTimestamps(data);
	const [inventory] = await db.insert(inventories).values(payloadWithTimestamps).returning();

	await db
		.insert(usersToInventories)
		.values({ userId: data.userId, inventoryId: inventory.id })
		.execute();

	return inventory;
}

export async function getTotalItemsCountForInventory(inventoryId: string) {
	const query = db
		.select({ totalItems: count(items.quantity).as('totalItems') })
		.from(usersToInventories)
		.leftJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		.leftJoin(categories, eq(categories.inventoryId, inventories.id))
		.leftJoin(subcategories, eq(subcategories.categoryId, categories.id))
		.leftJoin(items, eq(items.subcategoryId, subcategories.id))
		.where(eq(usersToInventories.inventoryId, inventoryId));

	const result = db.get<{ totalItems: number }>(query);
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

	const result = db.all<{ stockStatus: ItemQuantityStatus }>(query);
	return result.reduce((acc, res) => {
		acc[res.stockStatus] = (acc[res.stockStatus] || 0) + 1;
		return acc;
	}, {} as Record<ItemQuantityStatus, number>);
}
