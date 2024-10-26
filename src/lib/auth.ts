import { getUserByIdHandler } from '$/data-access/handlers/users.handler';
import { getUserIdFromCookie } from '$/services/auth/session.service';

export async function getCurrentUser() {
	const userId = getUserIdFromCookie();

	if (!userId) {
		return null;
	}

	return getUserByIdHandler(userId);
}
