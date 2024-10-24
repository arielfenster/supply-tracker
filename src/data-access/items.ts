import { db } from '$/db/db';
import { items } from '$/db/schemas';
import { CreateItemInput } from '$/schemas/items/create-item.schema';
import { UpdateItemInput } from '$/schemas/items/update-item.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from './utils';

export async function createItem(payload: CreateItemInput) {
	const itemWithSameName = await db.query.items
		.findFirst({
			where: (fields, { and, eq }) =>
				and(eq(fields.name, payload.name), eq(fields.subcategoryId, payload.subcategoryId)),
		})
		.execute();

	if (itemWithSameName) {
		throw new Error(`Item '${payload.name}' already exists in this subcategory`);
	}

	const [newItem] = await db
		.insert(items)
		.values({
			...payload,
			...generateTimestamps(),
		})
		.returning();

	return newItem;
}

export async function updateItem(payload: UpdateItemInput) {
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

export async function deleteItem(id: string) {
	const [deleted] = await db.delete(items).where(eq(items.id, id)).returning();

	return deleted;
}

export async function findItemWithSimilarName(targetName: string, currentSubcategoryId: string) {
	return db.query.items.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, targetName), eq(fields.subcategoryId, currentSubcategoryId)),
	});
}
