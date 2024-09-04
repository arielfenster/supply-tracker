'use server';

import { NewItem } from '$/db/schemas';
import { formDataToObject2 } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import { createItemSchema } from '$/schemas/items/create-item.schema';
import { UpdateItemInput, updateItemSchema } from '$/schemas/items/update-item.schema';
import { addItem, deleteItem, updateItem } from '$/services/inventory.service';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function addItemAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const data = createItemSchema.parse(formDataToObject2<NewItem>(formData));
		await addItem(data);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Item added',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function updateItemAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const data = updateItemSchema.parse(formDataToObject2<UpdateItemInput>(formData));
		await updateItem(data);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Item updated',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function deleteItemAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { id } = updateItemSchema.parse(formDataToObject2<UpdateItemInput>(formData));
		await deleteItem(id);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Item deleted',
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}

function extractItemDataValues(formData: FormData): Record<keyof NewItem, string> {
	const values: Record<string, string> = {};

	const keyRegex = /^items\.(\d+)\.(\w+)$/;

	for (const [key, value] of formData.entries()) {
		const regexMatch = key.match(keyRegex);
		if (!regexMatch) {
			continue;
		}

		const fieldName = regexMatch[2];
		values[fieldName] = value as string;
	}

	return values;
}
