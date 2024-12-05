'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes } from '$/lib/routes';
import { ServerActionState } from '$/lib/types';
import {
	UpdateUserNotificationsInput,
	updateUserNotificationsSchema,
} from '$/schemas/user/update-user-notifications.schema';
import {
	UpdateUserProfileInput,
	updateUserProfileSchema,
} from '$/schemas/user/update-user-profile.schema';
import { updateUserNotifications, updateUserProfile } from '$/services/users.service';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateUserProfileSchema.parse(formDataToObject<UpdateUserProfileInput>(formData));
		await updateUserProfile(data);

		revalidatePath(AppRoutes.PAGES.USER);

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

export async function updateUserNotificationsAction(
	formData: FormData,
): Promise<ServerActionState> {
	try {
		const data = updateUserNotificationsSchema.parse(
			formDataToObject<UpdateUserNotificationsInput>(formData),
		);
		await updateUserNotifications(data);

		revalidatePath(AppRoutes.PAGES.USER);

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
