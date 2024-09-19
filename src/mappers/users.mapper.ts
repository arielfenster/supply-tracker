import { User } from '$/db/schemas';
import { UpdateUserInput } from '$/schemas/user/update-user.schema';

export type UpdateUserDTO = Pick<UpdateUserInput, 'id' | 'firstName' | 'lastName' | 'email'> &
	Partial<Pick<User, 'password'>>;

export function updateUserInputToUpdateDTO(input: UpdateUserInput): UpdateUserDTO {
	return {
		id: input.id,
		email: input.email,
		password: input.newPassword || undefined,
		firstName: input.firstName,
		lastName: input.lastName,
	};
}
