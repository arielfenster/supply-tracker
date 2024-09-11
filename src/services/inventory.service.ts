import { createCategory, editCategory, removeCategory } from '$/data-access/categories';
import { createItem, deleteItem as deleteItemDataAccess, editItem } from '$/data-access/items';
import { createSubcategory, editSubcategory, removeSubcategory } from '$/data-access/subcategories';
import { NewCategory, NewItem, NewSubcategory } from '$/db/schemas';
import { getUserId } from '$/lib/auth';
import { UpdateItemInput } from '$/schemas/inventory/items/update-item.schema';

export async function addCategory(name: string) {
	const userId = getUserId();
	return createCategory(name, userId!);
}

export async function updateCategory(payload: Required<Pick<NewCategory, 'id' | 'name'>>) {
	const userId = getUserId()!;
	const payloadWithUserId = Object.assign(payload, { userId });

	return editCategory(payloadWithUserId);
}

export async function deleteCategory(id: string) {
	return removeCategory(id);
}

export async function addSubcategory(name: string, categoryId: string) {
	const userId = getUserId();
	return createSubcategory(name, categoryId, userId!);
}

export async function updateSubcategory(payload: Required<Pick<NewSubcategory, 'id' | 'name'>>) {
	const userId = getUserId()!;
	const payloadWithUserId = Object.assign(payload, { userId });

	return editSubcategory(payloadWithUserId);
}

export async function deleteSubcategory(id: string) {
	return removeSubcategory(id);
}

export async function addItem(payload: NewItem) {
	return createItem(payload);
}

export async function updateItem(payload: UpdateItemInput) {
	return editItem(payload);
}

export async function deleteItem(id: string) {
	return deleteItemDataAccess(id);
}
