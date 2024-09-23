import {
	createSubcategory,
	deleteSubcategory,
	updateSubcategory,
} from '$/data-access/subcategories';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { assertUserExists } from './users.service';

export async function addSubcategoryUseCase(input: CreateSubcategoryInput) {
	await assertUserExists();

	return createSubcategory(input);
}

export async function updateSubcategoryUseCase(input: UpdateSubcategoryInput) {
	await assertUserExists();

	return updateSubcategory(input);
}

export async function deleteSubcategoryUseCase(id: string) {
	return deleteSubcategory(id);
}
