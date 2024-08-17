import { db } from '$/db/db';
import { categories } from '$/db/schemas';
import { nanoid } from 'nanoid';

export async function getUserCategories(userId: string) {
	return db.query.categories.findMany({
		where(fields, operators) {
			return operators.eq(fields.userId, userId);
		},
	});
}

export async function getUserCategoriesWithSubCategories(userId: string) {
	return db.query.categories.findMany({
		where: (categories, { eq }) => eq(categories.userId, userId),
		with: {
			subcategories: true,
		},
	});
}

export async function insertCategory(category: string) {
	// const userId = await getUserId();

	return db.insert(categories).values({
		name: category,
		userId: 'user-1',
	});
}
