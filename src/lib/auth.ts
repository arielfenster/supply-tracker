import { getUserByIdHandler } from '$/data-access/handlers/users.handler';
import { cookies } from 'next/headers';
import { env } from './env';

export async function getCurrentUser() {
	const userId = getUserIdFromCookie();

	if (!userId) {
		return null;
	}

	return getUserByIdHandler(userId);
}

export function getUserIdFromCookie() {
	return cookies().get(env.server.SESSION.COOKIE_NAME)?.value;
}
