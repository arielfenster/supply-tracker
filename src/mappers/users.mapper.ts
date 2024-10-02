import { User } from '$/db/schemas';
import { UpdateUserProfileInput } from '$/schemas/user/update-user-profile.schema';

export type UpdateUserProfileDTO = Pick<
	UpdateUserProfileInput,
	'id' | 'firstName' | 'lastName' | 'email'
> &
	Partial<Pick<User, 'password'>>;

export type UpdateUserNotificationsDTO = Pick<
	User,
	'id' | 'notificationsDay' | 'notificationsTime'
>;

export function updateUserProfileInputToUpdateDTO(
	input: UpdateUserProfileInput,
): UpdateUserProfileDTO {
	return {
		id: input.id,
		email: input.email,
		password: input.newPassword || undefined,
		firstName: input.firstName,
		lastName: input.lastName,
	};
}
