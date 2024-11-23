import { Database } from '$/db/db';
import { categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from '../utils';

export async function createCategory(data: CreateCategoryInput, db: Database) {
	const [category] = await db
		.insert(categories)
		.values({
			...data,
			...generateTimestamps(),
		})
		.returning();

	return category;
}

export async function updateCategory(data: UpdateCategoryInput, db: Database) {
	const { updatedAt } = generateTimestamps();

	const [updated] = await db
		.update(categories)
		.set({ name: data.name, updatedAt })
		.where(eq(categories.id, data.id))
		.returning();

	return updated;
}

export async function deleteCategory(id: string, db: Database) {
	const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

	return deleted;
}

export async function findCategoryWithSimilarName(
	data: { name: string; inventoryId: string },
	db: Database,
) {
	return db.query.categories.findFirst({
		where: (fields, { eq, and, ilike }) =>
			and(ilike(fields.name, data.name), eq(fields.inventoryId, data.inventoryId)),
	});
}

export async function getCategoryById(id: string, db: Database) {
	return db.query.categories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}
