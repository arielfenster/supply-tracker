import { db } from '$/db/db';
import { Category, categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { eq } from 'drizzle-orm';
import { addCurrentTimestamps } from './utils';

export async function createCategory(data: CreateCategoryInput) {
	await assertUniqueCategoryNameVariation(data);

	const dataWithTimestamps = addCurrentTimestamps(data);
	const [category] = await db.insert(categories).values(dataWithTimestamps).returning();

	return category;
}

export async function updateCategory(data: UpdateCategoryInput) {
	await assertUniqueCategoryNameVariation(data);

	const { name, updatedAt, id } = addCurrentTimestamps(data);
	const [updated] = await db
		.update(categories)
		.set({ name, updatedAt })
		.where(eq(categories.id, id))
		.returning();

	return updated;
}

export async function deleteCategory(id: string) {
	const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

	return deleted;
}

/**
 * Determines whether another category with the input name already exists that isn't the input category itself.
 * If it's a create request - checking for existence.
 * If it's an update request - checking for ids equality.
 */
async function assertUniqueCategoryNameVariation(
	data: Pick<Category, 'inventoryId' | 'name'> & Partial<Pick<Category, 'id'>>,
) {
	const { name, inventoryId, id } = data;

	const existingCategory = await db.query.categories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, name), eq(fields.inventoryId, inventoryId)),
	});

	if (!id && existingCategory) {
		throw new Error(`A variation of category '${name}' already exists in this inventory`);
	}

	if (id && existingCategory && existingCategory.id !== id) {
		throw new Error(`A variation of category '${name}' already exists in this inventory`);
	}
}
