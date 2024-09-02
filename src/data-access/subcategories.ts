import { db } from '$/db/db';
import { subcategories } from '$/db/schemas';

export async function createSubcategory(name: string, categoryId: string, userId: string) {
	const existingSubcategory = await db.query.subcategories.findFirst({
		where: (fields, { eq, and }) => and(eq(fields.name, name), eq(fields.categoryId, categoryId)),
	});

	if (existingSubcategory) {
		throw new Error(`Subcategory '${name}' already exists in this collection`);
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
