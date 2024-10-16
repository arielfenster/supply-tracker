import { db } from '$/db/db';
import { categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { eq } from 'drizzle-orm';
import { getCurrentTimestamps } from './utils';

export async function createCategory(data: CreateCategoryInput) {
	const [category] = await db
		.insert(categories)
		.values({
			...data,
			...getCurrentTimestamps(),
		})
		.returning();

	return category;
}

export async function updateCategory(data: UpdateCategoryInput) {
	const { updatedAt } = getCurrentTimestamps();

	const [updated] = await db
		.update(categories)
		.set({ name: data.name, updatedAt })
		.where(eq(categories.id, data.id))
		.returning();

	return updated;
}

export async function deleteCategory(id: string) {
	const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

	return deleted;
}

export async function findCategoryWithSimilarName(targetName: string, currentInventoryId: string) {
	return db.query.categories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, targetName), eq(fields.inventoryId, currentInventoryId)),
	});
}
