'use server';

import { insertCategory } from '$/data-access/categories';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: FormData) {
	const category = formData.get('category') as string;

	await insertCategory(category);

	revalidatePath('/manage');
}
