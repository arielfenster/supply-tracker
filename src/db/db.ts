import { IS_PROD, env } from '$/lib/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas';

export function getLocalFileUrl() {
	return `file:${env.server.DATABASE_URL}`;
}

const client = createClient({
	url: IS_PROD ? env.server.DATABASE_URL : getLocalFileUrl(),
	authToken: env.server.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client, { schema: schemas });

export type Database = typeof db;
export { db };
