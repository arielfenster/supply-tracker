'use server';

import { env } from '$/lib/env';
import { formDataToObject } from '$/lib/forms';
import { AppRoutes, appRedirect } from '$/lib/redirect';
import { signupSchema } from '$/schemas/auth/signup.schema';
import { signupUser } from '$/services/auth/signup.service';
import { cookies } from 'next/headers';

export type SignupUserState =
	| {
			success: true;
			message: string;
	  }
	| { success: false; error: string };

export async function signupUserAction(
	_state: SignupUserState,
	formData: FormData,
): Promise<SignupUserState> {
	try {
		const { email, password } = signupSchema.parse(formDataToObject(formData, signupSchema));
		const user = await signupUser({ email, password });

		const { COOKIE_NAME, COOKIE_MAX_AGE } = env.server.SESSION;

		cookies().set(COOKIE_NAME, user.id, {
			httpOnly: true,
			sameSite: true,
			secure: true,
			maxAge: COOKIE_MAX_AGE,
		});

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
