import dotenv from 'dotenv';
import { convertMinutesToMilliseconds } from './time';

export const IS_PROD = process.env.NODE_ENV === 'production';

dotenv.config({
	path: IS_PROD ? '.env.production' : '.env.local',
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
			DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
			SESSION: {
				COOKIE_MAX_AGE: convertMinutesToMilliseconds(1 * 7 * 24 * 60),
				COOKIE_SECRET: process.env.COOKIE_SECRET!,
				COOKIE_NAME: process.env.COOKIE_NAME!,
			},
			EMAIL: {
				API_KEY: process.env.EMAIL_API_KEY!,
				SENDER: process.env.EMAIL_SENDER!,
			},
		},
	};

	return env;
}

export const env = createEnv();
