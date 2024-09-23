import { db } from '$/db/db';
import { categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { eq } from 'drizzle-orm';

export async function createCategory(data: CreateCategoryInput) {
	const existingCategory = await db.query.categories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, data.name), eq(fields.inventoryId, data.inventoryId)),
	});

	if (existingCategory) {
		throw new Error(`A variation of category '${name}' already exists in this inventory`);
	}

	const [category] = await db.insert(categories).values(data).returning();
	return category;
}

export async function updateCategory(data: UpdateCategoryInput) {
	const [updated] = await db
		.update(categories)
		.set({ name: data.name })
		.where(eq(categories.id, data.id))
		.returning();

	return updated;
}

export async function deleteCategory(id: string) {
	const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

	return deleted;
}
