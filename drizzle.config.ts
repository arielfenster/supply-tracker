import { env } from '$/lib/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dbCredentials: {
		url: env.server.DATABASE_URL,
	},
});
