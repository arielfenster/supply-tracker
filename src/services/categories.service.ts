import {
	createCategory,
	deleteCategory,
	findCategoryWithSimilarName,
	updateCategory,
} from '$/data-access/categories';
import { Category } from '$/db/schemas';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { assertUserExists } from './users.service';

export async function addCategoryUseCase(input: CreateCategoryInput) {
	await assertUserExists();
	await assertUniqueCategoryNameVariation(input);

	return createCategory(input);
}

export async function updateCategoryUseCase(input: UpdateCategoryInput) {
	await assertUserExists();
	await assertUniqueCategoryNameVariation(input);

	return updateCategory(input);
}

export async function deleteCategoryUseCase(id: string) {
	await assertUserExists();

	return deleteCategory(id);
}

/**
 * Determines whether another category with the input name already exists that isn't the input category itself.
 * If it's a create request - checking for existence.
 * If it's an update request - checking for ids equality.
 */
async function assertUniqueCategoryNameVariation(
	data: Pick<Category, 'inventoryId' | 'name'> & Partial<Pick<Category, 'id'>>,
) {
	const { name, inventoryId, id } = data;

	const existingCategory = await findCategoryWithSimilarName(name, inventoryId);

	if (!id && existingCategory) {
		throw new Error(`A variation of category '${name}' already exists in this inventory`);
	}

	if (id && existingCategory && existingCategory.id !== id) {
		throw new Error(`A variation of category '${name}' already exists in this inventory`);
	}
}
