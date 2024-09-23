import { createItem, deleteItem, updateItem } from '$/data-access/items';
import { CreateItemInput } from '$/schemas/items/create-item.schema';
import { UpdateItemInput } from '$/schemas/items/update-item.schema';
import { assertUserExists } from './users.service';

export async function addItemUseCase(input: CreateItemInput) {
	await assertUserExists();

	return createItem(input);
}

export async function updateItemUseCase(input: UpdateItemInput) {
	await assertUserExists();

	return updateItem(input);
}

export async function deleteItemUseCase(id: string) {
	return deleteItem(id);
}
