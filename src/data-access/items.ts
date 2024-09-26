import { db } from '$/db/db';
import { items } from '$/db/schemas';
import { CreateItemInput } from '$/schemas/items/create-item.schema';
import { UpdateItemInput } from '$/schemas/items/update-item.schema';
import { eq } from 'drizzle-orm';
import { addCurrentTimestamps } from './utils';

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

	const payloadWithTimestamps = addCurrentTimestamps(payload);
	const [newItem] = await db.insert(items).values(payloadWithTimestamps).returning();

	return newItem;
}

export async function updateItem(payload: UpdateItemInput) {
	const { createdAt: _, ...data } = addCurrentTimestamps(payload);

	const [updated] = await db.update(items).set(data).where(eq(items.id, data.id)).returning();

	return updated;
}

export async function deleteItem(id: string) {
	const [deleted] = await db.delete(items).where(eq(items.id, id)).returning();

	return deleted;
}
