import { db } from '$/db/db';
import { categories, inventories, items, subcategories, usersToInventories } from '$/db/schemas';
import { and, count, eq, sql } from 'drizzle-orm';

export type UserInventory = Awaited<ReturnType<typeof getUserInventories>>[number];

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

export async function createInventory({ name, userId }: { name: string; userId: string }) {
	const existingUserInventoriesWithSameName = await db
		.select()
		.from(usersToInventories)
		.leftJoin(inventories, eq(usersToInventories.inventoryId, inventories.id))
		.where(and(eq(usersToInventories.userId, userId), eq(inventories.name, name)))
		.execute();

	if (existingUserInventoriesWithSameName.length) {
		throw new Error(`Inventory ${name} already exists`);
	}

	const [created] = await db.insert(inventories).values({ name }).returning();

	await db.insert(usersToInventories).values({ userId, inventoryId: created.id }).execute();

	return created;
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
	const query = sql`
		SELECT stockStatus, COUNT(*) AS count
		FROM (
			SELECT 
			CASE 
				WHEN "items"."quantity" = 0 THEN ${ItemQuantityStatus.OUT_OF_STOCK}
				WHEN "items"."quantity" < "items"."dangerThreshold" THEN ${ItemQuantityStatus.DANGER_STOCK}
				WHEN "items"."quantity" < "items"."warningThreshold" THEN ${ItemQuantityStatus.WARNING_STOCK}
				ELSE ${ItemQuantityStatus.IN_STOCK}
			END AS stockStatus
			FROM 
				"usersToInventories"
			LEFT JOIN 
				"inventories" ON "usersToInventories"."inventoryId" = "inventories"."id"
			LEFT JOIN 
				"categories" ON "categories"."inventoryId" = "inventories"."id"
			LEFT JOIN 
				"subcategories" ON "subcategories"."categoryId" = "categories"."id"
			LEFT JOIN 
				"items" ON "items"."subcategoryId" = "subcategories"."id"
			WHERE 
				"usersToInventories"."inventoryId" = ${inventoryId}
		)
		GROUP BY stockStatus;
`;

	const query2 = db
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

	const result = db.all<{ stockStatus: ItemQuantityStatus; count: number }>(query);
	const parsedResult = result.reduce((acc, res) => {
		acc[res.stockStatus] = res.count;
		return acc;
	}, {} as Record<ItemQuantityStatus, number>);

	const result2 = db.all<{ stockStatus: ItemQuantityStatus }>(query2);
	const parsedResult2 = result2.reduce((acc, res) => {
		acc[res.stockStatus] = (acc[res.stockStatus] || 0) + 1;
		return acc;
	}, {} as Record<ItemQuantityStatus, number>);

	console.log('@@@@@@@@@');
	console.log(result);
	console.log(parsedResult);
	console.log(result2);
	console.log(parsedResult2);
	return result2;
}

// export async function getInventoryStats(inventoryId: string): Promise<{
// 	totalItems: number;
// 	warningItems: number;
// 	dangerItems: number;
// 	missingItems: number;
// }> {}
