import { db } from '$/db/db';
import { items } from '$/db/schemas';
import { CreateItemInput } from '$/schemas/items/create-item.schema';
import { UpdateItemInput } from '$/schemas/items/update-item.schema';
import { updateInventoryFromEntity } from '$/services/inventories.service';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from './utils';

export async function createItem(payload: CreateItemInput) {
	return db.transaction(async (tx) => {
		try {
			const [newItem] = await db
				.insert(items)
				.values({
					...payload,
					...generateTimestamps(),
				})
				.returning();

			await updateInventoryFromEntity(newItem, tx);

			return newItem;
		} catch (error) {
			console.error(`Failed to create item. payload: ${JSON.stringify(payload)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function updateItem(payload: UpdateItemInput) {
	return db.transaction(async (tx) => {
		try {
			const { updatedAt } = generateTimestamps();

			const [updated] = await db
				.update(items)
				.set({
					...payload,
					updatedAt,
				})
				.where(eq(items.id, payload.id))
				.returning();

			await updateInventoryFromEntity(updated, tx);

			return updated;
		} catch (error) {
			console.error(`Failed to updated item. payload: ${JSON.stringify(payload)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function deleteItem(id: string) {
	return db.transaction(async (tx) => {
		try {
			const [deleted] = await db.delete(items).where(eq(items.id, id)).returning();

			await updateInventoryFromEntity(deleted, tx);

			return deleted;
		} catch (error) {
			console.error(`Failed to delete item. payload: ${JSON.stringify({ id })}. error: `, error);
			tx.rollback();
		}
	});
}

export async function findItemWithSimilarName(targetName: string, currentSubcategoryId: string) {
	return db.query.items.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, targetName), eq(fields.subcategoryId, currentSubcategoryId)),
	});
}

export async function getItemById(id: string) {
	return db.query.items.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}
