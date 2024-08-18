'use server';

import { getUserCategories, insertCategory } from '$/data-access/categories';
import { getUserCollections } from '$/data-access/users';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: FormData) {
	const category = formData.get('category') as string;

	await insertCategory(category);

	revalidatePath('/manage');
}

export async function getUserCollectionsAction(userId: string) {
	return getUserCollections(userId);
}
