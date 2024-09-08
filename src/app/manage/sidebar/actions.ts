'use server';

import { formDataToObject, formDataToObject2 } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import { addCategorySchema } from '$/schemas/inventory/categories/add-category.schema';
import {
	UpdateCategoryInput,
	updateCategorySchema,
} from '$/schemas/inventory/categories/update-category.schema';
import {
	AddSubcategoryInput,
	addSubcategorySchema,
} from '$/schemas/inventory/subcategories/add-subcategory.schema';
import {
	UpdateSubcategoryInput,
	updateSubcategorySchema,
} from '$/schemas/inventory/subcategories/update-subcategory.schema';
import { logoutUser } from '$/services/auth/login.service';
import {
	addCategory,
	addSubcategory,
	updateCategory,
	updateSubcategory,
} from '$/services/inventory.service';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

export async function addCategoryAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { name } = addCategorySchema.parse(formDataToObject(formData, addCategorySchema));
		await addCategory(name);

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
		const { name, categoryId } = addSubcategorySchema.parse(
			formDataToObject2<AddSubcategoryInput>(formData),
		);
		await addSubcategory(name, categoryId!);

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

export async function updateCategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateCategorySchema.parse(formDataToObject2<UpdateCategoryInput>(formData));
		await updateCategory(data);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Subcategory updated',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function updateSubcategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateSubcategorySchema.parse(formDataToObject2<UpdateSubcategoryInput>(formData));
		await updateSubcategory(data);

		revalidatePath(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: 'Subcategory updated',
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof ZodError ? error.issues[0].message : (error as Error).message,
		};
	}
}

export async function deleteCategoryAction(formData: FormData): Promise<ActionStateType> {
	console.log(formData);
	return {
		success: true,
		message: 'wow',
	};
}
export async function deleteSubcategoryAction(formData: FormData): Promise<ActionStateType> {
	console.log(formData);
	return {
		success: true,
		message: 'wow',
	};
}
