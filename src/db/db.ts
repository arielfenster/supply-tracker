import { env } from '$/lib/env';
import * as schemas from './schemas';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const db = drizzle(postgres(env.server.DATABASE_URL), { schema: schemas });

export type Database = typeof db;
export { db };
