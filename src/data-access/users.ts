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
			where: (fields, { eq }) => eq(fields.email, email),
		})
		.execute();
}

export async function getUserById(id: string) {
	return db.query.users
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}
