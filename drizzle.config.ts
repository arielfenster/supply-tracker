import { env } from '$/lib/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	driver: process.env.NODE_ENV === 'production' ? 'turso' : undefined,
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dbCredentials: {
		url: env.server.DATABASE_URL,
		authToken: env.server.DATABASE_AUTH_TOKEN,
	},
});
