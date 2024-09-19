import { z } from 'zod';
import { signupSchema } from '../auth/signup.schema';
import { passwordSchema } from '../auth/password.schema';

export const updateUserSchema = signupSchema
	.pick({
		email: true,
	})
	.extend({
		id: z.string(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		currentPassword: passwordSchema.optional().or(z.literal('')),
		newPassword: passwordSchema.optional().or(z.literal('')),
	});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
