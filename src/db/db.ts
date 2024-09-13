import { env } from '$/lib/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schemas from './schemas';

const client = postgres(env.server.DATABASE_URL, { max: 1 });
const db = drizzle(client, { schema: schemas });

export type Database = typeof db;
export { db };
