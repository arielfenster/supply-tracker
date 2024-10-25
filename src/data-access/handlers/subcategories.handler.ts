import { db } from '$/db/db';
import { Subcategory, subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import {
	createSubcategory,
	deleteSubcategory,
	findSubcategoryWithSimilarName,
	getSubcategoryById,
	updateSubcategory,
} from '../atomic/subcategories.atomic';
import { updateInventoryFromEntityHandler } from './inventories.handler';

export async function createSubcategoryHandler(data: CreateSubcategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const subcategory = await createSubcategory(data, tx);
			await updateInventoryFromEntityHandler(subcategory, tx);

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

export async function updateSubcategoryHandler(data: UpdateSubcategoryInput) {
	return db.transaction(async (tx) => {
		try {
			const subcategory = await updateSubcategory(data, tx);
			await updateInventoryFromEntityHandler(subcategory, tx);

			return subcategory;
		} catch (error) {
			console.error(
				`Failed to update subcategory. payload: ${JSON.stringify(data)}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function deleteSubcategoryHandler(id: string) {
	return db.transaction(async (tx) => {
		try {
			const subcategory = await deleteSubcategory(id, tx);
			await updateInventoryFromEntityHandler(subcategory, tx);

			return subcategory;
		} catch (error) {
			console.error(
				`Failed to delete subcategory. payload: ${JSON.stringify({ id })}. error: `,
				error,
			);
			tx.rollback();
		}
	});
}

export async function findSubcategoryWithSimilarNameHandler(
	targetName: string,
	currentCategoryId: string,
) {
	return findSubcategoryWithSimilarName({ name: targetName, categoryId: currentCategoryId }, db);
}

export async function getSubcategoryByIdHandler(id: string) {
	return getSubcategoryById(id, db);
}

export function isSubcategory(entity: any): entity is Subcategory {
	return subcategories.categoryId.name in entity;
}
