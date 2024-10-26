import { env } from '$/lib/env';
import { cookies } from 'next/headers';

export function setSessionCookie(userId: string) {
	const { COOKIE_NAME, COOKIE_MAX_AGE } = env.server.SESSION;

	return cookies().set(COOKIE_NAME, userId, {
		httpOnly: true,
		sameSite: true,
		secure: true,
		maxAge: COOKIE_MAX_AGE,
	});
}

export function removeSessionCookie() {
	return cookies().delete(env.server.SESSION.COOKIE_NAME);
}

export function getUserIdFromCookie() {
	return cookies().get(env.server.SESSION.COOKIE_NAME)?.value;
}
