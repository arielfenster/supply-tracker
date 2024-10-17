import { env } from '$/lib/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas';

const client = createClient({
	url: `file:${env.server.DATABASE_URL}`,
	authToken: env.server.DATABASE_AUTH_TOKEN,
});
const db = drizzle(client, { schema: schemas });

export type Database = typeof db;
export { db };
