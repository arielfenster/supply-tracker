import { getUserById, updateNotifications, updateUserInfo } from '$/data-access/users';
import { getCurrentUser } from '$/lib/auth';
import {
	updateUserNotificationsInputToUpdateDTO,
	updateUserProfileInputToUpdateDTO,
} from '$/mappers/users.mapper';
import { UpdateUserNotificationsInput } from '$/schemas/user/update-user-notifications.schema';
import { UpdateUserProfileInput } from '$/schemas/user/update-user-profile.schema';
import { comparePasswords, hashPassword } from './auth/password.service';

export async function updateUserProfile(payload: UpdateUserProfileInput) {
	const { currentPassword, newPassword } = payload;

	const user = await getUserById(payload.id);
	if (!user) {
		throw new Error('User not found');
	}

	if (currentPassword) {
		if (!(await comparePasswords(currentPassword, user!.password))) {
			throw new Error('Incorrect current password');
		}
	}

	const hashedPassword = newPassword ? await hashPassword(newPassword) : undefined;
	const updatedUserDto = updateUserProfileInputToUpdateDTO({
		...payload,
		newPassword: hashedPassword,
	});

	return updateUserInfo(updatedUserDto);
}

export async function updateUserNotifications(payload: UpdateUserNotificationsInput) {
	const user = await getUserById(payload.id);
	if (!user) {
		throw new Error('User not found');
	}

	return updateNotifications(payload);
}

export async function assertUserExists() {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error('Current user not found');
	}

	return user;
}
