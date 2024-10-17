import { getLocalFileUrl } from '$/db/db';
import { IS_PROD, env } from '$/lib/env';
import { defineConfig } from 'drizzle-kit';

const localConfig = defineConfig({
	dialect: 'sqlite',
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dbCredentials: {
		url: getLocalFileUrl(),
	},
});

const prodConfig = defineConfig({
	dialect: 'turso',
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dbCredentials: {
		url: env.server.DATABASE_URL,
		authToken: env.server.DATABASE_AUTH_TOKEN,
	},
});

export default IS_PROD ? localConfig : prodConfig;
