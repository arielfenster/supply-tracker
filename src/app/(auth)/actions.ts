'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { type ServerActionState } from '$/lib/types';
import { LoginInput, loginSchema } from '$/schemas/auth/login.schema';
import { SignupInput, signupSchema } from '$/schemas/auth/signup.schema';
import { loginUser } from '$/services/auth/login.service';
import { signupUser } from '$/services/auth/signup.service';
import { redirect } from 'next/navigation';

export async function signupUserAction(formData: FormData): Promise<ServerActionState> {
	try {
		const { email, password } = signupSchema.parse(formDataToObject<SignupInput>(formData));
		await signupUser({ email, password });

		redirect(AppRoutes.PAGES.DASHBOARD);

		return {
			success: true,
			message: "Welcome! You'll be redirected shortly",
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function loginUserAction(formData: FormData): Promise<ServerActionState> {
	try {
		const { email, password } = loginSchema.parse(formDataToObject<LoginInput>(formData));
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
