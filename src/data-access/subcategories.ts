import { db } from '$/db/db';
import { Subcategory, subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { eq } from 'drizzle-orm';

export async function createSubcategory(data: CreateSubcategoryInput) {
	await assertUniqueSubcategoryNameVariation(data);

	const [subcategory] = await db.insert(subcategories).values(data).returning();
	return subcategory;
}

export async function updateSubcategory(data: UpdateSubcategoryInput) {
	await assertUniqueSubcategoryNameVariation(data);

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

/**
 * Determines whether another subcategory with the input name already exists that isn't the input subcategory itself.
 * If it's a create request - checking for existence.
 * If it's an update request - checking for ids equality.
 */
async function assertUniqueSubcategoryNameVariation(
	data: Pick<Subcategory, 'categoryId' | 'name'> & Partial<Pick<Subcategory, 'id'>>,
) {
	const { name, categoryId, id } = data;

	const subcategoryWithSameName = await db.query.subcategories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, name), eq(fields.categoryId, categoryId)),
	});

	if (subcategoryWithSameName && !id) {
		throw new Error(`A variation of subcategory '${name}' already exists in this category`);
	}

	if (subcategoryWithSameName?.id !== id) {
		throw new Error(`A variation of subcategory '${name}' already exists in this category`);
	}
}
