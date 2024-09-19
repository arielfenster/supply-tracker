import { ZodError } from 'zod';

export function formDataToObject<TInput extends Record<string, any>>(
	formData: FormData,
): Record<keyof TInput, string> {
	return Object.fromEntries(formData) as Record<keyof TInput, string>;
}

export function getActionError(error: unknown) {
	return error instanceof ZodError ? error.issues[0].message : (error as Error).message;
}
