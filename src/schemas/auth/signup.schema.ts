import { z } from 'zod';
import { passwordSchema } from './password.schema';

export const signupSchema = z.object({
	email: z.string().email().toLowerCase(),
	password: passwordSchema,
});

export type SignupInput = z.infer<typeof signupSchema>;
