import { db } from '$/db/db';
import { Category, categories } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import {
	createCategory,
	deleteCategory,
	findCategoryWithSimilarName,
	getCategoryById,
	updateCategory,
} from '../atomic/categories.atomic';
import { updateInventoryFromEntityHandler } from './inventories.handler';

export async function createCategoryHandler(data: CreateCategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const category = await createCategory(data, tx);
			await updateInventoryFromEntityHandler(category, tx);

			return category;
		} catch (error) {
			console.error(`Failed to create category. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function updateCategoryHandler(data: UpdateCategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const category = await updateCategory(data, tx);
			await updateInventoryFromEntityHandler(category, tx);

			return category;
		} catch (error) {
			console.error(`Failed to update category. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function deleteCategoryHandler(id: string) {
	return db.transaction(async (tx) => {
		try {
			const category = await deleteCategory(id, tx);
			await updateInventoryFromEntityHandler(category, tx);

			return category;
		} catch (error) {
			console.error(
				`Failed to delete category. payload: ${JSON.stringify({ id })}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function findCategoryWithSimilarNameHandler(
	targetName: string,
	currentInventoryId: string,
) {
	return findCategoryWithSimilarName({ name: targetName, inventoryId: currentInventoryId }, db);
}

export async function getCategoryByIdHandler(id: string) {
	return getCategoryById(id, db);
}

export function isCategory(entity: any): entity is Category {
	return categories.inventoryId.name in entity;
}
