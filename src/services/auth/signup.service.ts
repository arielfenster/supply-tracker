import { createUser } from '$/data-access/users';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { hashPassword } from './password.service';
import { setSessionCookie } from './session.service';

export async function signupUser(data: SignupInput) {
	const { email, password } = data;
	const hashedPassword = await hashPassword(password);

	const user = await createUser({ email: email.toLowerCase(), password: hashedPassword });
	setSessionCookie(user.id);

	return user;
}
