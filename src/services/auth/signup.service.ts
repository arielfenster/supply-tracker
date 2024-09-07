import { createUser } from '$/data-access/users';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { hashPassword } from './password.service';
import { setSessionCookie } from './session.service';

export async function signupUser(data: SignupInput) {
	const { email, password } = data;
	const hashedPassword = await hashPassword(password);

	try {
		const user = await createUser({ email, password: hashedPassword });
		setSessionCookie(user.id);

		return user;
	} catch (error) {
		throw new Error('Email already exists');
	}
}
