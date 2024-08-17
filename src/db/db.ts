import { env } from '$/lib/env';
import Sqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schemas from './schemas';

const sqlite3 = new Sqlite3(env.server.DATABASE_URL);
const db = drizzle(sqlite3, { schema: schemas });

export type Database = typeof db;
export { db };
