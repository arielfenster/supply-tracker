import { db } from '$/db/db';
import { NewCategory, categories } from '$/db/schemas';
import { and, eq } from 'drizzle-orm';

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
	const existingCategory = await db.query.categories.findFirst({
		where: (fields, { eq, and, ilike }) => and(ilike(fields.name, name), eq(fields.userId, userId)),
	});

	if (existingCategory) {
		throw new Error(`A variation of category '${name}' already exists`);
	}

	const [category] = await db
		.insert(categories)
		.values({
			name,
			userId,
		})
		.returning();

	return category;
}

export async function editCategory(data: Required<NewCategory>) {
	const { id, name, userId } = data;

	const [updated] = await db
		.update(categories)
		.set({ name })
		.where(and(eq(categories.id, id), eq(categories.userId, userId)))
		.returning();

	return updated;
}

export async function removeCategory(id: string) {
	const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();

	return deleted;
}
