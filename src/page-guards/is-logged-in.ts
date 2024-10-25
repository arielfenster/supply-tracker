import { getCurrentUser } from '$/lib/auth';

export async function isLoggedIn() {
	const user = await getCurrentUser();
	return !!user;
}
