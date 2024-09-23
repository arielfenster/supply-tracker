'use server';

import { NewItem } from '$/db/schemas';
import { formDataToObject } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ServerActionState } from '$/lib/types';
import { createItemSchema } from '$/schemas/items/create-item.schema';
import { UpdateItemInput, updateItemSchema } from '$/schemas/items/update-item.schema';
import { addItemUseCase, deleteItemUseCase, updateItemUseCase } from '$/services/items.service';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function addItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = createItemSchema.parse(formDataToObject<NewItem>(formData));
		await addItemUseCase(data);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

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

export async function updateItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateItemSchema.parse(formDataToObject<UpdateItemInput>(formData));
		await updateItemUseCase(data);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

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

export async function deleteItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const { id } = updateItemSchema.parse(formDataToObject<UpdateItemInput>(formData));
		await deleteItemUseCase(id);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

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
