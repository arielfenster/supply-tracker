import { Database, db } from '$/db/db';
import { User, users } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { UpdateUserNotificationsInput } from '$/schemas/user/update-user-notifications.schema';
import { eq } from 'drizzle-orm';
import { generateTimestamps } from './utils';

export type UpdateUserProfilePayload = Partial<
	Pick<User, 'firstName' | 'lastName' | 'email' | 'password' | 'id'>
>;

export async function createUser(data: SignupInput & { id?: string }, database: Database = db) {
	const [user] = await database
		.insert(users)
		.values({
			...data,
			...generateTimestamps(),
		})
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

export async function updateUserInfo(
	userId: string,
	payload: UpdateUserProfilePayload,
	database: Database = db,
) {
	if (payload.email) {
		const differentUserWithExistingEmail = await database.query.users
			.findFirst({
				where: (fields, { and, eq, ne }) =>
					and(eq(fields.email, payload.email!), ne(fields.id, userId)),
			})
			.execute();

		if (differentUserWithExistingEmail) {
			throw new Error('Email already exists');
		}
	}

	const { updatedAt } = generateTimestamps();
	const [updated] = await database
		.update(users)
		.set({ ...payload, updatedAt })
		.where(eq(users.id, userId))
		.returning();

	return updated;
}

export async function updateNotifications(payload: UpdateUserNotificationsInput) {
	const { updatedAt } = generateTimestamps();
	const [updated] = await db
		.update(users)
		.set({ ...payload, updatedAt })
		.where(eq(users.id, payload.id))
		.returning();

	return updated;
}

export async function deleteUser(id: string) {
	const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();

	return deleted;
}
