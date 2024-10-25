import {
	createSubcategory,
	deleteSubcategory,
	findSubcategoryWithSimilarName,
	updateSubcategory,
} from '$/data-access/subcategories';
import { Subcategory, subcategories } from '$/db/schemas';
import { CreateSubcategoryInput } from '$/schemas/subcategories/create-subcategory.schema';
import { UpdateSubcategoryInput } from '$/schemas/subcategories/update-subcategory.schema';
import { assertUserExists } from './users.service';

export async function addSubcategoryUseCase(input: CreateSubcategoryInput) {
	await assertUserExists();
	await assertUniqueSubcategoryNameVariation(input);

	return createSubcategory(input);
}

export async function updateSubcategoryUseCase(input: UpdateSubcategoryInput) {
	await assertUserExists();
	await assertUniqueSubcategoryNameVariation(input);

	return updateSubcategory(input);
}

export async function deleteSubcategoryUseCase(id: string) {
	return deleteSubcategory(id);
}

/**
 * Determines whether another subcategory with the input name already exists that isn't the input subcategory itself.
 * If it's a create request - checking for existence.
 * If it's an update request - checking for ids equality.
 */
async function assertUniqueSubcategoryNameVariation(
	data: Pick<Subcategory, 'categoryId' | 'name'> & Partial<Pick<Subcategory, 'id'>>,
) {
	const { name, categoryId, id } = data;

	const existingSubcategory = await findSubcategoryWithSimilarName(name, categoryId);

	if (!id && existingSubcategory) {
		throw new Error(`A variation of subcategory '${name}' already exists in this category`);
	}

	if (id && existingSubcategory && existingSubcategory.id !== id) {
		throw new Error(`A variation of subcategory '${name}' already exists in this category`);
	}
}

export function isSubcategory(entity: any): entity is Subcategory {
	return subcategories.categoryId.name in entity;
}
