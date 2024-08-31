import { db } from '$/db/db';
import { NewItem, items } from '$/db/schemas';
import { eq } from 'drizzle-orm';

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
