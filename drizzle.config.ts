import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({
	path: '.env.local',
});

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
});
