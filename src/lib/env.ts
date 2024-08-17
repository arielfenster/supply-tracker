import dotenv from 'dotenv';
import { convertMinutesToMilliseconds } from './time';

dotenv.config({
	path: '.env.local',
});

function getBaseApiUrl() {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api`;

	return `http://localhost:${process.env.PORT ?? 3000}/api`;
}

function createEnv() {
	const env = {
		client: {
			NEXT_PUBLIC_API_URL: getBaseApiUrl(),
		},
		server: {
			DATABASE_URL: process.env.DATABASE_URL!,
			AUTH: {
				HASHING_SALT_ROUNDS: parseInt(process.env.HASHING_SALT_ROUNDS!, 10) || 10,
			},
			SESSION: {
				COOKIE_MAX_AGE: convertMinutesToMilliseconds(1 * 7 * 24 * 60),
				COOKIE_SECRET: process.env.COOKIE_SECRET!,
				COOKIE_NAME: process.env.COOKIE_NAME!,
			},
			EMAIL: {
				USERNAME: process.env.EMAIL_USERNAME!,
				CLIENT_ID: process.env.EMAIL_CLIENT_ID!,
				CLIENT_SECRET: process.env.EMAIL_CLIENT_SECRET!,
				REFRESH_TOKEN: process.env.EMAIL_REFRESH_TOKEN!,
			},
		},
	};

	return env;
}

export const env = createEnv();
