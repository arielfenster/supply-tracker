import { Database } from '$/db/db';
import { Item, items } from '$/db/schemas';
import { CreateItemInput } from '$/schemas/items/submit-item.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from '../utils';

export async function createItem(payload: CreateItemInput, db: Database) {
	const [newItem] = await db
		.insert(items)
		.values({
			...payload,
			...generateTimestamps(),
		})
		.returning();

	return newItem;
}

export async function updateItem(payload: Partial<Item> & { id: string }, db: Database) {
	const { updatedAt } = generateTimestamps();

	const [updated] = await db
		.update(items)
		.set({
			...payload,
			updatedAt,
		})
		.where(eq(items.id, payload.id))
		.returning();

	return updated;
}

export async function deleteItem(id: string, db: Database) {
	const [deleted] = await db.delete(items).where(eq(items.id, id)).returning();

	return deleted;
}

export async function findItemWithSimilarName(
	data: { name: string; subcategoryId: string },
	db: Database,
) {
	return db.query.items.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, data.name), eq(fields.subcategoryId, data.subcategoryId)),
	});
}

export async function getItemById(id: string, db: Database) {
	return db.query.items.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}
