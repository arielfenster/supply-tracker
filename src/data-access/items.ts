import { db } from '$/db/db';
import { NewItem, items } from '$/db/schemas';
import { eq } from 'drizzle-orm';

export async function createItem(payload: NewItem) {
	const existingItem = await db.query.items
		.findFirst({
			where: (fields, { and, eq }) =>
				and(eq(fields.name, payload.name), eq(fields.subcategoryId, payload.subcategoryId)),
		})
		.execute();

	if (existingItem) {
		throw new Error(`Item '${payload.name}' already exists in this subcategory`);
	}

	const [newItem] = await db.insert(items).values(payload).returning();

	return newItem;
}

export async function updateItem(payload: Omit<NewItem, 'subcategoryId'>) {
	const [updated] = await db
		.update(items)
		.set(payload)
		.where(eq(items.id, payload.id!))
		.returning();

	return updated;
}

export async function deleteItem(id: string) {
	await db.delete(items).where(eq(items.id, id)).execute();
}

export async function getUserInventory(userId: string) {
	const data = await db.query.categories.findMany({
		where: (fields, { eq }) => eq(fields.userId, userId),
		with: {
			subcategories: {
				with: { items: true },
			},
		},
	});

	return {
		categories: data,
	};
}
