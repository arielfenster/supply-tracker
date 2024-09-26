import { db } from '$/db/db';
import { users } from '$/db/schemas';
import { UpdateUserNotificationsDTO, UpdateUserProfileDTO } from '$/mappers/users.mapper';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { eq } from 'drizzle-orm';
import { addCurrentTimestamps } from './utils';

export async function createUser(data: SignupInput) {
	const dataWithTimestamps = addCurrentTimestamps(data);
	const [user] = await db.insert(users).values(dataWithTimestamps).returning();

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

	const { createdAt: _, ...data } = addCurrentTimestamps(payload);
	const [updated] = await db.update(users).set(data).where(eq(users.id, data.id)).returning();

	return updated;
}

export async function updateNotifications(payload: UpdateUserNotificationsDTO) {
	const { createdAt: _, ...data } = addCurrentTimestamps(payload);
	const [updated] = await db.update(users).set(data).where(eq(users.id, data.id)).returning();

	return updated;
}
