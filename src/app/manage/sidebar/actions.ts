'use server';

import { createCategory } from '$/data-access/categories';
import { getUserId } from '$/lib/auth';
import { formDataToObject } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import { addCategorySchema } from '$/schemas/categories/add-category.schema';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function addCategoryAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { category } = addCategorySchema.parse(formDataToObject(formData, addCategorySchema));
		const userId = getUserId();
		await createCategory(category, userId!);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Huzzah!',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : JSON.stringify(error),
		};
	}
}
