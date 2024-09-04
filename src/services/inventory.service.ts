import { createCategory } from '$/data-access/categories';
import {
	createItem,
	deleteItem as deleteItemDataAccess,
	updateItem as updateItemDataAccess,
} from '$/data-access/items';
import { createSubcategory } from '$/data-access/subcategories';
import { NewItem } from '$/db/schemas';
import { getUserId } from '$/lib/auth';
import { UpdateItemInput } from '$/schemas/items/update-item.schema';

export async function addCategory(name: string) {
	const userId = getUserId();
	return createCategory(name, userId!);
}

export async function addSubcategory(name: string, categoryId: string) {
	const userId = getUserId();
	return createSubcategory(name, categoryId, userId!);
}

export async function addItem(payload: NewItem) {
	return createItem(payload);
}

export async function updateItem(payload: UpdateItemInput) {
	return updateItemDataAccess(payload);
}

export async function deleteItem(id: string) {
	return deleteItemDataAccess(id);
}
