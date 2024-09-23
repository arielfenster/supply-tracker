import { createCategory, deleteCategory, updateCategory } from '$/data-access/categories';
import { CreateCategoryInput } from '$/schemas/categories/create-category.schema';
import { UpdateCategoryInput } from '$/schemas/categories/update-category.schema';
import { assertUserExists } from './users.service';

export async function addCategoryUseCase(input: CreateCategoryInput) {
	await assertUserExists();

	return createCategory(input);
}

export async function updateCategoryUseCase(input: UpdateCategoryInput) {
	await assertUserExists();

	return updateCategory(input);
}

export async function deleteCategoryUseCase(id: string) {
	await assertUserExists();

	return deleteCategory(id);
}
