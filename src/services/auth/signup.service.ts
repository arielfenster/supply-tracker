import { createUser } from '$/data-access/users';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { hashPassword } from './password.service';

export async function signupUser(data: SignupInput) {
	const { email, password } = data;
	const hashedPassword = await hashPassword(password);

	return createUser({ email: email.toLowerCase(), password: hashedPassword });
}
