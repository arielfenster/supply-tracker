import { db } from '$/db/db';
import { subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from './utils';

export async function createSubcategory(data: CreateSubcategoryInput) {
	const [subcategory] = await db
		.insert(subcategories)
		.values({
			...data,
			...generateTimestamps(),
		})
		.returning();

	return subcategory;
}

export async function updateSubcategory(data: UpdateSubcategoryInput) {
	const { updatedAt } = generateTimestamps();

	const [updated] = await db
		.update(subcategories)
		.set({ name: data.name, updatedAt })
		.where(eq(subcategories.id, data.id))
		.returning();

	return updated;
}

export async function deleteSubcategory(id: string) {
	const [deleted] = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();

	return deleted;
}

export async function findSubcategoryWithSimilarName(
	targetName: string,
	currentCategoryId: string,
) {
	return db.query.subcategories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, targetName), eq(fields.categoryId, currentCategoryId)),
	});
}
