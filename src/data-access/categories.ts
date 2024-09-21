import { db } from '$/db/db';
import { NewCategory, categories } from '$/db/schemas';
import { and, eq } from 'drizzle-orm';

export async function createCategory(name: string, userId: string) {
	const existingCategory = await db.query.categories.findFirst({
		where: (fields, { eq, and, like,  }) => and(like(fields.name, name), eq(fields.userId, userId)),
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
