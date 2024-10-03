import { isOnlyOneDefined } from '$/lib/utils';
import { z } from 'zod';
import { passwordSchema } from '../auth/password.schema';

export const updateUserProfileSchema = z
	.object({
		id: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z
			.string()
			.email()
			.toLowerCase()
			.optional()
			.or(z.literal(''))
			.transform((val) => val || undefined),
		currentPassword: passwordSchema.optional().or(z.literal('')),
		newPassword: passwordSchema.optional().or(z.literal('')),
	})
	.superRefine(({ currentPassword, newPassword }, ctx) => {
		if (isOnlyOneDefined([currentPassword, newPassword])) {
			ctx.addIssue({
				code: 'custom',
				path: ['currentPassword'],
				message: 'Must either supply both values or none of them',
			});
		}

		if (currentPassword && newPassword && currentPassword === newPassword) {
			ctx.addIssue({
				code: 'custom',
				path: ['newPassword'],
				message: "New password can't be the same as the current password",
			});
		}
	});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
