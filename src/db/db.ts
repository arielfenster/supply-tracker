import { env } from '$/lib/env';
import sqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schemas from './schemas';

const client = sqlite3(env.server.DATABASE_URL);
const db = drizzle(client, { schema: schemas });

export type Database = typeof db;
export { db };
