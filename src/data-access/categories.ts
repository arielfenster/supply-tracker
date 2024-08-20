import { db } from '$/db/db';
import { categories } from '$/db/schemas';

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

export async function createCategory(name: string, userId: string) {
	const [category] = await db
		.insert(categories)
		.values({
			name,
			userId,
		})
		.returning();

	return category;
}
