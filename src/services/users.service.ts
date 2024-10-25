import {
	getUserByIdHandler,
	updateUserNotificationsHandler,
	updateUserInfoHandler,
} from '$/data-access/handlers/users.handler';
import { getCurrentUser } from '$/lib/auth';
import { UpdateUserNotificationsInput } from '$/schemas/user/update-user-notifications.schema';
import { UpdateUserProfileInput } from '$/schemas/user/update-user-profile.schema';
import { nanoid } from 'nanoid';
import { comparePasswords, hashPassword } from './auth/password.service';

const TEMP_USER_ID_PREFIX = 'TEMP_USER_';

export async function updateUserProfile(payload: UpdateUserProfileInput) {
	const { currentPassword, newPassword } = payload;

	const user = await getUserByIdHandler(payload.id);
	if (!user) {
		throw new Error('User not found');
	}

	if (currentPassword) {
		if (!(await comparePasswords(currentPassword, user!.password))) {
			throw new Error('Incorrect current password');
		}
	}

	const hashedPassword = newPassword ? await hashPassword(newPassword) : undefined;

	return updateUserInfoHandler(payload.id, {
		firstName: payload.firstName,
		lastName: payload.lastName,
		email: payload.email,
		password: hashedPassword,
	});
}

export async function updateUserNotifications(payload: UpdateUserNotificationsInput) {
	const user = await getUserByIdHandler(payload.id);
	if (!user) {
		throw new Error('User not found');
	}

	return updateUserNotificationsHandler(payload);
}

export async function assertUserExists() {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error('Current user not found');
	}

	return user;
}

export function generateTempUserId() {
	return `${TEMP_USER_ID_PREFIX}${nanoid()}`;
}

export function isTempUserId(id: string) {
	return id.startsWith(TEMP_USER_ID_PREFIX);
}

export function generateTempUserPassword() {
	return nanoid();
}
