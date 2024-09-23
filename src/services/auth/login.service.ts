import { getUserByEmail } from '$/data-access/users';
import { getUserIdFromCookie } from '$/lib/auth';
import { LoginInput } from '$/schemas/auth/login.schema';
import { comparePasswords } from './password.service';
import { removeSessionCookie, setSessionCookie } from './session.service';

export async function loginUser(data: LoginInput) {
	const { email, password } = data;

	const user = await getUserByEmail(email);

	if (!user) {
		throw new Error('Email not found');
	}

	if (!(await comparePasswords(password, user.password))) {
		throw new Error('Incorrect password');
	}

	setSessionCookie(user.id);
	return user;
}

export function logoutUser() {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("Cannot logout a user that isn't logged in");
	}

	removeSessionCookie();
}
