import { db } from '$/db/db';

export async function getUserCollections(id: string) {
	return db.query.categories.findMany({
		where: ({ userId }, { eq }) => eq(userId, id),
		with: {
			subcategories: {
				with: { items: true },
			},
		},
	});
}
