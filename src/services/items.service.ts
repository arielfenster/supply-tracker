import {
	createItemHandler,
	deleteItemHandler,
	findItemWithSimilarNameHandler,
	updateItemHandler,
	moveItemHandler,
} from '$/data-access/handlers/items.handler';
import { Item } from '$/db/schemas';
import { MoveItemInput } from '$/schemas/items/move-item.schema';
import {
	CreateItemInput,
	SubmitItemInput,
	UpdateItemInput,
} from '$/schemas/items/submit-item.schema';
import { assertUserExists } from './users.service';

export async function submitItemUseCase(input: SubmitItemInput) {
	if (input.id) {
		return updateItemUseCase(input as UpdateItemInput);
	}

	delete input.id;
	return addItemUseCase(input);
}

async function addItemUseCase(input: CreateItemInput) {
	await assertUserExists();
	await assertUniqueItemNameVariation(input);

	return createItemHandler(input);
}

async function updateItemUseCase(input: UpdateItemInput) {
	await assertUserExists();
	await assertUniqueItemNameVariation(input);

	return updateItemHandler(input);
}

export async function moveItemUseCase(input: MoveItemInput) {
	await assertUserExists();

	return moveItemHandler(input);
}

export async function deleteItemUseCase(id: string) {
	return deleteItemHandler(id);
}

/**
 * Determines whether another item with the input name already exists that isn't the input item itself.
 * If it's a create request - checking for existence.
 * If it's an update request - checking for ids equality.
 */
async function assertUniqueItemNameVariation(
	data: Pick<Item, 'subcategoryId' | 'name'> & Partial<Pick<Item, 'id'>>,
) {
	const { name, subcategoryId, id } = data;

	const existingItem = await findItemWithSimilarNameHandler(name, subcategoryId);

	if (!id && existingItem) {
		throw new Error(`A variation of item '${name}' already exists in this subcategory`);
	}

	if (id && existingItem && existingItem.id !== id) {
		throw new Error(`A variation of item '${name}' already exists in this subcategory`);
	}
}
