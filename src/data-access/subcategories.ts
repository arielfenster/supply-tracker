import { db } from '$/db/db';
import { NewSubcategory, subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { and, eq } from 'drizzle-orm';

export async function createSubcategory(data: CreateSubcategoryInput) {
	const subcategoryWithSameName = await db.query.subcategories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, data.name), eq(fields.categoryId, data.categoryId)),
	});

	if (subcategoryWithSameName) {
		throw new Error(`A variation of subcategory '${data.name}' already exists in this collection`);
	}

	const [subcategory] = await db.insert(subcategories).values(data).returning();

	return subcategory;
}

export async function updateSubcategory(data: UpdateSubcategoryInput) {
	const [updated] = await db
		.update(subcategories)
		.set({ name: data.name })
		.where(eq(subcategories.id, data.id))
		.returning();

	return updated;
}

export async function deleteSubcategory(id: string) {
	const [deleted] = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();

	return deleted;
}
