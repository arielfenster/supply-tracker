'use server';

import { formDataToObject } from '$/lib/forms';
import { AppRoutes, appRedirect } from '$/lib/redirect';
import { type ActionStateType } from '$/lib/types';
import { loginSchema } from '$/schemas/auth/login.schema';
import { signupSchema } from '$/schemas/auth/signup.schema';
import { loginUser } from '$/services/auth/login.service';
import { signupUser } from '$/services/auth/signup.service';

export async function signupUserAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { email, password } = signupSchema.parse(formDataToObject(formData, signupSchema));
		await signupUser({ email, password });

		appRedirect(AppRoutes.PAGES.MANAGE);

		return {
			success: true,
			message: "Welcome! You'll be redirected shortly",
		};
	} catch (error) {
		return {
			success: false,
			error: JSON.stringify(error),
		};
	}
}

export async function loginUserAction(
	_state: ActionStateType,
	formData: FormData,
): Promise<ActionStateType> {
	try {
		const { email, password } = loginSchema.parse(formDataToObject(formData, loginSchema));
		await loginUser({ email, password });

		return {
			success: true,
			message: "Welcome! You'll be redirected shortly",
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}
