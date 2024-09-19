import { getUserById, updateUserInfo } from '$/data-access/users';
import { updateUserInputToUpdateDTO } from '$/mappers/users.mapper';
import { UpdateUserInput } from '$/schemas/user/update-user.schema';
import { comparePasswords, hashPassword } from './auth/password.service';

export async function updateUser(payload: UpdateUserInput) {
	const { currentPassword, newPassword } = payload;

	if (!(await getUserById(payload.id))) {
		throw new Error('User not found');
	}

	if (currentPassword && newPassword && currentPassword === newPassword) {
		throw new Error("New password can't be the same as the current password");
	}

	if (currentPassword) {
		const user = await getUserById(payload.id);
		if (!(await comparePasswords(currentPassword, user!.password))) {
			throw new Error('Incorrect current password');
		}
	}

	const hashedPassword = newPassword ? await hashPassword(newPassword) : undefined;
	const updatedUserDto = updateUserInputToUpdateDTO({ ...payload, newPassword: hashedPassword });

	return updateUserInfo(updatedUserDto);
}
