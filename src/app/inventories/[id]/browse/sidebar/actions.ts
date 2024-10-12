'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ServerActionState } from '$/lib/types';
import {
	CreateCategoryInput,
	createCategorySchema,
} from '$/schemas/categories/create-category.schema';
import {
	DeleteCategoryInput,
	deleteCategorySchema,
} from '$/schemas/categories/delete-category.schema';
import {
	UpdateCategoryInput,
	updateCategorySchema,
} from '$/schemas/categories/update-category.schema';
import {
	CreateSubcategoryInput,
	createSubcategorySchema,
} from '$/schemas/subcategories/create-subcategory.schema';
import {
	DeleteSubcategoryInput,
	deleteSubcategorySchema,
} from '$/schemas/subcategories/delete-subcategory.schema';
import {
	UpdateSubcategoryInput,
	updateSubcategorySchema,
} from '$/schemas/subcategories/update-subcategory.schema';
import {
	addCategoryUseCase,
	deleteCategoryUseCase,
	updateCategoryUseCase,
} from '$/services/categories.service';
import {
	addSubcategoryUseCase,
	deleteSubcategoryUseCase,
	updateSubcategoryUseCase,
} from '$/services/subcategories.service';
import { revalidatePath } from 'next/cache';

export async function addCategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = createCategorySchema.parse(formDataToObject<CreateCategoryInput>(formData));
		await addCategoryUseCase(data);

		revalidatePath('/');

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

export async function addSubcategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = createSubcategorySchema.parse(formDataToObject<CreateSubcategoryInput>(formData));
		await addSubcategoryUseCase(data);

		revalidatePath('/');

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

export async function updateCategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateCategorySchema.parse(formDataToObject<UpdateCategoryInput>(formData));
		await updateCategoryUseCase(data);

		revalidatePath('/');

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

export async function updateSubcategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateSubcategorySchema.parse(formDataToObject<UpdateSubcategoryInput>(formData));
		await updateSubcategoryUseCase(data);

		revalidatePath('/');

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

export async function deleteCategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = deleteCategorySchema.parse(formDataToObject<DeleteCategoryInput>(formData));
		await deleteCategoryUseCase(data.id);

		revalidatePath('/');

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

export async function deleteSubcategoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = deleteSubcategorySchema.parse(formDataToObject<DeleteSubcategoryInput>(formData));
		await deleteSubcategoryUseCase(data.id);

		revalidatePath('/');

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
