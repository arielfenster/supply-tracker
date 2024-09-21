import { ZodError } from 'zod';
import { ServerActionError, ServerActionState, ServerActionSuccess } from './types';

export function formDataToObject<TInput extends Record<string, any>>(
	formData: FormData,
): Record<keyof TInput, string> {
	return Object.fromEntries(formData) as Record<keyof TInput, string>;
}

export function getActionError(error: unknown) {
	return error instanceof ZodError ? error.issues[0].message : (error as Error).message;
}

export type ServerActionToasts = {
	success: (result: ServerActionSuccess) => void;
	error: (result: ServerActionError) => void;
};

export function executeServerAction(
	action: (formData: FormData) => Promise<ServerActionState>,
	toasts?: ServerActionToasts,
) {
	return async function (formData: FormData) {
		const result = await action(formData);
		if (result.success) {
			toasts?.success(result);
		} else {
			toasts?.error(result);
		}
	};
}
