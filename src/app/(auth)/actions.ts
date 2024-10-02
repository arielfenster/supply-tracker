'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { type ServerActionState } from '$/lib/types';
import { LoginInput, loginSchema } from '$/schemas/auth/login.schema';
import { SignupInput, signupSchema } from '$/schemas/auth/signup.schema';
import { loginUser } from '$/services/auth/login.service';
import { signupUser } from '$/services/auth/signup.service';

export async function signupUserAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = signupSchema.parse(formDataToObject<SignupInput>(formData));
		await signupUser(data);

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
		const data = loginSchema.parse(formDataToObject<LoginInput>(formData));
		await loginUser(data);

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
