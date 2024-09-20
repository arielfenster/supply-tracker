import { db } from '$/db/db';
import { users } from '$/db/schemas';
import { UpdateUserNotificationsDTO, UpdateUserProfileDTO } from '$/mappers/users.mapper';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { eq } from 'drizzle-orm';

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

export async function updateUserInfo(payload: UpdateUserProfileDTO) {
	const differentUserWithExistingEmail = await db.query.users
		.findFirst({
			where: (fields, { and, eq, ne }) =>
				and(eq(fields.email, payload.email), ne(fields.id, payload.id)),
		})
		.execute();

	if (differentUserWithExistingEmail) {
		throw new Error('Email already exists');
	}

	const [updated] = await db.update(users).set(payload).where(eq(users.id, payload.id)).returning();

	return updated;
}

export async function updateNotifications(payload: UpdateUserNotificationsDTO) {
	const [updated] = await db.update(users).set(payload).where(eq(users.id, payload.id)).returning();

	return updated;
}
