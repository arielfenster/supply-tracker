import { db } from '$/db/db';
import { Item, items } from '$/db/schemas';
import { MoveItemInput } from '$/schemas/items/move-item.schema';
import { CreateItemInput, UpdateItemInput } from '$/schemas/items/submit-item.schema';
import {
	createItem,
	deleteItem,
	findItemWithSimilarName,
	getItemById,
	updateItem,
} from '../atomic/items.atomic';
import { findSubcategory } from '../atomic/subcategories.atomic';
import { updateInventoryFromEntityHandler } from './inventories.handler';

export async function createItemHandler(payload: CreateItemInput) {
	return db.transaction(async (tx) => {
		try {
			const item = await createItem(payload, tx);
			await updateInventoryFromEntityHandler(item, tx);

			return item;
		} catch (error) {
			console.error(`Failed to create item. payload: ${JSON.stringify(payload)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function updateItemHandler(payload: UpdateItemInput) {
	return db.transaction(async (tx) => {
		try {
			const item = await updateItem(payload, tx);
			await updateInventoryFromEntityHandler(item, tx);

			return item;
		} catch (error) {
			console.error(`Failed to updated item. payload: ${JSON.stringify(payload)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function moveItemHandler(payload: MoveItemInput) {
	const { itemId, subcategoryId, categoryId } = payload;

	return db.transaction(async (tx) => {
		try {
			await findSubcategory({ id: subcategoryId, categoryId }, tx); // verifying the subcategoryId-categoryId pair is valid
			const item = await updateItem({ id: itemId, subcategoryId }, tx);

			await updateInventoryFromEntityHandler(item, tx);

			return item;
		} catch (error) {
			console.error(`Failed to move item. payload: ${JSON.stringify(payload)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function deleteItemHandler(id: string) {
	return db.transaction(async (tx) => {
		try {
			const item = await deleteItem(id, tx);
			await updateInventoryFromEntityHandler(item, tx);

			return item;
		} catch (error) {
			console.error(`Failed to delete item. payload: ${JSON.stringify({ id })}. error: `, error);
			tx.rollback();
		}
	});
}

export async function findItemWithSimilarNameHandler(
	targetName: string,
	currentSubcategoryId: string,
) {
	return findItemWithSimilarName({ name: targetName, subcategoryId: currentSubcategoryId }, db);
}

export async function getItemByIdHandler(id: string) {
	return getItemById(id, db);
}

export function isItem(entity: any): entity is Item {
	return items.subcategoryId.name in entity;
}
