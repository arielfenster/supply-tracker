'use server';

import { formDataToObject } from '$/lib/forms';
import { AppRoutes, appRedirect } from '$/lib/redirect';
import { loginSchema } from '$/schemas/auth/login.schema';
import { signupSchema } from '$/schemas/auth/signup.schema';
import { loginUser } from '$/services/auth/login.service';
import { signupUser } from '$/services/auth/signup.service';

type UserAuthStateSuccess = {
	success: true;
	message: string;
};

type UserAuthStateError = { success: false; error: string };

export type UserAuthStateType = UserAuthStateSuccess | UserAuthStateError;

export async function signupUserAction(
	_state: UserAuthStateType,
	formData: FormData,
): Promise<UserAuthStateType> {
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
	_state: UserAuthStateType,
	formData: FormData,
): Promise<UserAuthStateType> {
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
