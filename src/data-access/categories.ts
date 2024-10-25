import { db } from '$/db/db';
import { categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { eq } from 'drizzle-orm';
import { updateInventory } from './inventories';
import { generateTimestamps } from './utils';

export async function createCategory(data: CreateCategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const [category] = await tx
				.insert(categories)
				.values({
					...data,
					...generateTimestamps(),
				})
				.returning();

			await updateInventory({ id: data.inventoryId }, tx);

			return category;
		} catch (error) {
			console.error(`Failed to create category. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function updateCategory(data: UpdateCategoryInput) {
	const { updatedAt } = generateTimestamps();

	return db.transaction(async (tx) => {
		try {
			const [updated] = await tx
				.update(categories)
				.set({ name: data.name, updatedAt })
				.where(eq(categories.id, data.id))
				.returning();

			await updateInventory({ id: data.inventoryId }, tx);

			return updated;
		} catch (error) {
			console.error(`Failed to update category. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function deleteCategory(id: string) {
	return db.transaction(async (tx) => {
		try {
			const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

			await updateInventory({ id: deleted.inventoryId }, tx);

			return deleted;
		} catch (error) {
			console.error(
				`Failed to delete category. payload: ${JSON.stringify({ id })}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function findCategoryWithSimilarName(targetName: string, currentInventoryId: string) {
	return db.query.categories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, targetName), eq(fields.inventoryId, currentInventoryId)),
	});
}

export async function getCategoryById(id: string) {
	return db.query.categories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}
