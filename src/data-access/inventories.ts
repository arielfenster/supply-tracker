import { db } from '$/db/db';
import { inventories, usersToInventories } from '$/db/schemas';
import { and, eq } from 'drizzle-orm';

function getFullInventoryPath(): {
	categories: { with: { subcategories: { with: { items: true } } } };
} {
	return {
		categories: {
			with: {
				subcategories: {
					with: {
						items: true,
					},
				},
			},
		},
	};
}

export async function getUserInventories(userId: string) {
	return db.query.usersToInventories.findMany({
		where: (fields, { eq }) => eq(fields.userId, userId),
		with: {
			inventory: {
				with: getFullInventoryPath(),
			},
		},
	});
}

export async function getInventoryById(id: string) {
	return db.query.inventories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
		with: getFullInventoryPath(),
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
