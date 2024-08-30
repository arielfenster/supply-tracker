import { db } from '$/db/db';
import { categories, subcategories } from '$/db/schemas';

export async function getUserCategories(userId: string) {
	return db.query.categories.findMany({
		where(fields, operators) {
			return operators.eq(fields.userId, userId);
		},
	});
}

export async function getUserCategoriesWithSubCategories(userId: string) {
	return db.query.categories.findMany({
		where: (fields, { eq }) => eq(fields.userId, userId),
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

export async function createSubcategory(name: string, categoryId: string, userId: string) {
	const existingSubcategory = await db.query.subcategories.findFirst({
		where: (fields, { eq }) => eq(fields.name, name),
	});

	if (existingSubcategory) {
		throw new Error(`Subcategory '${name}' already exists`);
	}

	const [subcategory] = await db
		.insert(subcategories)
		.values({
			name,
			userId,
			categoryId,
		})
		.returning();

	return subcategory;
}
