'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ActionStateType } from '$/lib/types';
import {
	AddCategoryInput,
	addCategorySchema,
} from '$/schemas/inventory/categories/add-category.schema';
import {
	DeleteCategoryInput,
	deleteCategorySchema,
} from '$/schemas/inventory/categories/delete-category.schema';
import {
	UpdateCategoryInput,
	updateCategorySchema,
} from '$/schemas/inventory/categories/update-category.schema';
import {
	AddSubcategoryInput,
	addSubcategorySchema,
} from '$/schemas/inventory/subcategories/add-subcategory.schema';
import {
	DeleteSubcategoryInput,
	deleteSubcategorySchema,
} from '$/schemas/inventory/subcategories/delete-subcategory.schema';
import {
	UpdateSubcategoryInput,
	updateSubcategorySchema,
} from '$/schemas/inventory/subcategories/update-subcategory.schema';
import {
	addCategory,
	addSubcategory,
	deleteCategory,
	deleteSubcategory,
	updateCategory,
	updateSubcategory,
} from '$/services/inventory.service';
import { revalidatePath } from 'next/cache';

export async function addCategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const { name } = addCategorySchema.parse(formDataToObject<AddCategoryInput>(formData));
		await addCategory(name);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Category created',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function addSubcategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const { name, categoryId } = addSubcategorySchema.parse(
			formDataToObject<AddSubcategoryInput>(formData),
		);
		await addSubcategory(name, categoryId!);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Subcategory added',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function updateCategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateCategorySchema.parse(formDataToObject<UpdateCategoryInput>(formData));
		await updateCategory(data);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Subcategory updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function updateSubcategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateSubcategorySchema.parse(formDataToObject<UpdateSubcategoryInput>(formData));
		await updateSubcategory(data);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Subcategory updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function deleteCategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const { id } = deleteCategorySchema.parse(formDataToObject<DeleteCategoryInput>(formData));
		await deleteCategory(id);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Category deleted',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function deleteSubcategoryAction(formData: FormData): Promise<ActionStateType> {
	try {
		const { id } = deleteSubcategorySchema.parse(
			formDataToObject<DeleteSubcategoryInput>(formData),
		);
		await deleteSubcategory(id);

		revalidatePath(AppRoutes.PAGES.INVENTORY);

		return {
			success: true,
			message: 'Subcategory deleted',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
