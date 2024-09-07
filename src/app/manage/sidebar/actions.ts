'use server';

import { formDataToObject, formDataToObject2 } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import { addCategorySchema } from '$/schemas/categories/add-category.schema';
import {
	AddSubcategoryInput,
	addSubcategorySchema,
} from '$/schemas/categories/add-subcategory.schema';
import { logoutUser } from '$/services/auth/login.service';
import { addCategory, addSubcategory } from '$/services/inventory.service';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function addCategoryAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { category } = addCategorySchema.parse(formDataToObject(formData, addCategorySchema));
		await addCategory(category);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Category created',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function addSubcategoryAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { subcategory, categoryId } = addSubcategorySchema.parse(
			formDataToObject2<AddSubcategoryInput>(formData),
		);
		await addSubcategory(subcategory, categoryId!);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Subcategory added',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function logoutUserAction(): Promise<ActionStateType> {
	try {
		logoutUser();
		return {
			success: true,
			message: '',
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}
