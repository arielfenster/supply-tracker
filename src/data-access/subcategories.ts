import { db } from '$/db/db';
import { subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { updateInventoryFromEntity } from '$/services/inventories.service';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from './utils';

export async function createSubcategory(data: CreateSubcategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const [subcategory] = await db
				.insert(subcategories)
				.values({
					...data,
					...generateTimestamps(),
				})
				.returning();

			await updateInventoryFromEntity(subcategory, tx);

			return subcategory;
		} catch (error) {
			console.error(
				`Failed to create subcategory. payload: ${JSON.stringify(data)}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function updateSubcategory(data: UpdateSubcategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const { updatedAt } = generateTimestamps();

			const [updated] = await db
				.update(subcategories)
				.set({ name: data.name, updatedAt })
				.where(eq(subcategories.id, data.id))
				.returning();

			await updateInventoryFromEntity(updated, tx);

			return updated;
		} catch (error) {
			console.error(
				`Failed to update subcategory. payload: ${JSON.stringify(data)}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function deleteSubcategory(id: string) {
	return db.transaction(async (tx) => {
		try {
			const [deleted] = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();

			await updateInventoryFromEntity(deleted, tx);

			return deleted;
		} catch (error) {
			console.error(
				`Failed to delete subcategory. payload: ${JSON.stringify({ id })}. error: `,
				error,
			);
			tx.rollback();
		}
	});
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

export async function getSubcategoryById(id: string) {
	return db.query.subcategories.findFirst({
		where: (fields, { eq }) => eq(fields.id, id),
	});
}
