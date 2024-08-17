import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
	// return argon2.hash(password);
	return bcrypt.hash(password, await bcrypt.genSalt());
}

export async function comparePasswords(plain: string, hash: string) {
	// return argon2.verify(hash, plain);
	return bcrypt.compare(plain, hash);
}
