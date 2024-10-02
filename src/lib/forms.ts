import { ZodError } from 'zod';
import { ServerActionError, ServerActionState, ServerActionSuccess } from './types';

export function formDataToObject<TInput extends Record<string, any>>(
	formData: FormData,
): Record<keyof TInput, string> {
	return Object.fromEntries(formData) as Record<keyof TInput, string>;
}

export function getActionError(error: unknown) {
	// FIXME: sometimes this doesnt give good error messages
	return error instanceof ZodError ? error.issues[0].message : (error as Error).message;
}

// TODO: move to types
export type ServerActionFunction = (formData: FormData) => Promise<ServerActionState>;

export type ServerActionToasts = {
	success?: (result: ServerActionSuccess) => void;
	error?: (result: ServerActionError) => void;
};

export function executeServerAction(
	action: ServerActionFunction,
	setPending: (pending: boolean) => void,
	toasts?: ServerActionToasts,
) {
	return async function (formData: FormData) {
		setPending(true);
		const result = await action(formData);
		setPending(false);

		if (result.success) {
			toasts?.success?.(result);
		} else {
			toasts?.error?.(result);
		}
	};
}
