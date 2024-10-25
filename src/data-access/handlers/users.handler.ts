import { db } from '$/db/db';
import { User } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { UpdateUserNotificationsInput } from '$/schemas/user/update-user-notifications.schema';
import {
	createUser,
	deleteUser,
	getUserByEmail,
	getUserById,
	isEmailAlreadyInUse,
	updateUser,
} from '../atomic/users.atomic';

export type UpdateUserProfilePayload = Partial<
	Pick<User, 'firstName' | 'lastName' | 'email' | 'password' | 'id'>
>;

export async function createUserHandler(data: SignupInput & { id?: string }) {
	return createUser(data, db);
}

export async function getUserByEmailHandler(email: string) {
	return getUserByEmail(email, db);
}

export async function getUserByIdHandler(id: string) {
	return getUserById(id, db);
}

export async function updateUserInfoHandler(userId: string, payload: UpdateUserProfilePayload) {
	if (
		payload.email &&
		(await isEmailAlreadyInUse({ email: payload.email, emailOwnerId: userId }, db))
	) {
		throw new Error('Email already exists');
	}

	return updateUser(userId, payload, db);
}

export async function updateUserNotificationsHandler(payload: UpdateUserNotificationsInput) {
	return updateUser(payload.id, payload, db);
}

export async function deleteUserHandler(id: string) {
	return deleteUser(id, db)
}
