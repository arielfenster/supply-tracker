import { getUserById } from '$/data-access/users';
import { cookies } from 'next/headers';
import { env } from './env';

export async function getUser() {
	const userId = getUserId();

	if (!userId) {
		return null;
	}

	return getUserById(userId);
}

export function getUserId() {
	return cookies().get(env.server.SESSION.COOKIE_NAME)?.value;
}
