'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ActionStateType } from '$/lib/types';
import { UpdateUserInput, updateUserSchema } from '$/schemas/user/update-user.schema';
import { updateUser } from '$/services/users.service';

export async function updateUserInfoAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateUserSchema.parse(formDataToObject<UpdateUserInput>(formData));
		await updateUser(data);

		return {
			success: true,
			message: 'User info updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
