import { Database } from '$/db/db';
import { NewUser, users } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from '../utils';

export async function createUser(data: SignupInput & { id?: string }, db: Database) {
	const [user] = await db
		.insert(users)
		.values({
			...data,
			...generateTimestamps(),
		})
		.returning();

	return user;
}

export async function getUserByEmail(email: string, db: Database) {
	return db.query.users
		.findFirst({
			where: (fields, { eq }) => eq(fields.email, email),
		})
		.execute();
}

export async function getUserById(id: string, db: Database) {
	return db.query.users
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}

export async function isEmailAlreadyInUse(
	data: { email: string; emailOwnerId: string },
	db: Database,
) {
	const existingUser = await db.query.users
		.findFirst({
			where: (fields, { and, eq, ne }) =>
				and(eq(fields.email, data.email), ne(fields.id, data.emailOwnerId)),
		})
		.execute();

	return !!existingUser;
}

export async function updateUser(id: string, payload: Partial<NewUser>, db: Database) {
	const { updatedAt } = generateTimestamps();
	const [updated] = await db
		.update(users)
		.set({ ...payload, updatedAt })
		.where(eq(users.id, id))
		.returning();

	return updated;
}

export async function deleteUser(id: string, db: Database) {
	const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();

	return deleted;
}
