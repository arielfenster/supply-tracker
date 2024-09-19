import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const passwordSchema = z.string().min(MIN_PASSWORD_LENGTH, {
	message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
});
