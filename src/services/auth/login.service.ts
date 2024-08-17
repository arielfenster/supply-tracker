import { getUserByEmail } from '$/data-access/users';
import { LoginInput } from '$/schemas/auth/login.schema';
import { comparePasswords } from './password.service';
import { setSessionCookie } from './session.service';

export async function loginUser(data: LoginInput) {
	const { email, password } = data;

	const user = await getUserByEmail(email.toLowerCase());

	if (!user) {
		throw new Error(`Email not found`);
	}

	if (!(await comparePasswords(password, user.password))) {
		throw new Error('Incorrect password');
	}

	setSessionCookie(user.id);
	return user;
}
