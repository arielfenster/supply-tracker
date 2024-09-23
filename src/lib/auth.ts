import { getUserById } from '$/data-access/users';
import { cookies } from 'next/headers';
import { env } from './env';

export async function getCurrentUser() {
	const userId = getUserIdFromCookie();

	if (!userId) {
		return null;
	}

	return getUserById(userId);
}

export function getUserIdFromCookie() {
	return cookies().get(env.server.SESSION.COOKIE_NAME)?.value;
}
