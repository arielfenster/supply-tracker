'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ActionStateType } from '$/lib/types';
import {
	UpdateUserNotificationsInput,
	updateUserNotificationsSchema,
} from '$/schemas/user/update-user-notifications.schema';
import {
	UpdateUserProfileInput,
	updateUserProfileSchema,
} from '$/schemas/user/update-user-profile.schema';
import { updateUserNotifications, updateUserProfile } from '$/services/users.service';

export async function updateUserProfileAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateUserProfileSchema.parse(formDataToObject<UpdateUserProfileInput>(formData));
		await updateUserProfile(data);

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

export async function updateUserNotificationsAction(formData: FormData): Promise<ActionStateType> {
	try {
		const data = updateUserNotificationsSchema.parse(
			formDataToObject<UpdateUserNotificationsInput>(formData),
		);
		await updateUserNotifications(data);

		return {
			success: true,
			message: 'Notification settings updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
