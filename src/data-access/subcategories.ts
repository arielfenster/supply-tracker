import { db } from '$/db/db';
import { NewSubcategory, subcategories } from '$/db/schemas';
import { and, eq } from 'drizzle-orm';

export async function createSubcategory(name: string, categoryId: string, userId: string) {
	const existingSubcategory = await db.query.subcategories.findFirst({
		where: (fields, { eq, and, like }) =>
			and(like(fields.name, name), eq(fields.categoryId, categoryId)),
	});

	if (existingSubcategory) {
		throw new Error(`A variation of subcategory '${name}' already exists in this collection`);
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

export async function editSubcategory(data: Required<Omit<NewSubcategory, 'categoryId'>>) {
	const { id, name, userId } = data;

	const [updated] = await db
		.update(subcategories)
		.set({ name })
		.where(and(eq(subcategories.id, id), eq(subcategories.userId, userId)))
		.returning();

	return updated;
}

export async function removeSubcategory(id: string) {
	const [deleted] = await db.delete(subcategories).where(eq(subcategories.id, id)).returning();

	return deleted;
}
