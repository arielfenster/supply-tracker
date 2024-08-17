import { db } from '$/db/db';
import { users } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';

export async function createUser(data: SignupInput) {
	const [user] = await db
		.insert(users)
		.values({ ...data })
		.returning();
	return user;
}

export async function getUserByEmail(email: string) {
	return db.query.users
		.findFirst({
			where: (model, { eq }) => eq(model.email, email),
		})
		.execute();
}

export async function getUserById(id: string) {
	return db.query.users
		.findFirst({
			where: (model, { eq }) => eq(model.id, id),
		})
		.execute();
}

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
