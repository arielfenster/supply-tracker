import { z } from 'zod';
import { signupSchema } from './signup.schema';

export const loginSchema = signupSchema.pick({ email: true, password: true });

export type LoginInput = z.infer<typeof loginSchema>;
