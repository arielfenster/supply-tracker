import { Database } from '$/db/db';
import { NewSubcategory, subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from '../utils';

export async function createSubcategory(data: CreateSubcategoryInput, db: Database) {
	const [subcategory] = await db
		.insert(subcategories)
		.values({
			...data,
			...generateTimestamps(),
		})
		.returning();

	return subcategory;
}

export async function updateSubcategory(data: UpdateSubcategoryInput, db: Database) {
	const { updatedAt } = generateTimestamps();

	const [updated] = await db
		.update(subcategories)
		.set({ name: data.name, updatedAt })
		.where(eq(subcategories.id, data.id))
		.returning();

	return updated;
}

export async function deleteSubcategory(id: string, db: Database) {
	const [deleted] = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();

	return deleted;
}

export async function findSubcategoryWithSimilarName(
	data: { name: string; categoryId: string },
	db: Database,
) {
	return db.query.subcategories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, data.name), eq(fields.categoryId, data.categoryId)),
	});
}

export async function getSubcategoryById(id: string, db: Database) {
	return db.query.subcategories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}

export async function findSubcategory(params: Partial<NewSubcategory>, db: Database) {
	return db.query.subcategories.findFirst({
		where: (fields, { or, eq }) =>
			or(
				eq(fields.id, params.id || ''),
				eq(fields.categoryId, params.categoryId || ''),
				eq(fields.name, params.name || ''),
			),
	});
}
