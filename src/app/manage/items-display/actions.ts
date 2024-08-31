'use server';

import { deleteItem, updateItem } from '$/data-access/items';
import { NewItem } from '$/db/schemas';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import { updateItemSchema } from '$/schemas/items/update-item.schema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function updateItemAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const values = extractItemDataValues(formData);
		const parsed = updateItemSchema.parse(values);
		await updateItem(parsed);

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
		const id = formData.values().next().value;
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
