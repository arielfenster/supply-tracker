'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ServerActionState } from '$/lib/types';
import { DeleteItemInput, deleteItemSchema } from '$/schemas/items/delete-item.schema';
import { MoveItemInput, moveItemSchema } from '$/schemas/items/move-item.schema';
import { SubmitItemInput, submitItemSchema } from '$/schemas/items/submit-item.schema';
import { deleteItemUseCase, moveItemUseCase, submitItemUseCase } from '$/services/items.service';
import { revalidatePath } from 'next/cache';

export async function submitItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = submitItemSchema.parse(formDataToObject<SubmitItemInput>(formData));
		await submitItemUseCase(data);

		revalidatePath('/');

		return {
			success: true,
			message: data.id ? 'Item added' : 'Item updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function moveItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = moveItemSchema.parse(formDataToObject<MoveItemInput>(formData));
		await moveItemUseCase(data);

		revalidatePath('/');

		return {
			success: true,
			message: 'Item moved',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function deleteItemAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = deleteItemSchema.parse(formDataToObject<DeleteItemInput>(formData));
		await deleteItemUseCase(data.id);

		revalidatePath('/');

		return {
			success: true,
			message: 'Item deleted',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
