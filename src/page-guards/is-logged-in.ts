import { env } from '$/lib/env';
import { cookies } from 'next/headers';

export function isLoggedIn() {
	return cookies().has(env.server.SESSION.COOKIE_NAME);
}
