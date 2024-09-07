import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const signupSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: z.string().min(MIN_PASSWORD_LENGTH, {
		message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
	}),
});

export type SignupInput = z.infer<typeof signupSchema>;
