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
			HOST_URL: process.env.HOST_URL!,
			DATABASE_URL: process.env.DATABASE_URL!,
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
