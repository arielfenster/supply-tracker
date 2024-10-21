import { env } from '$/lib/env';
import sqlite3 from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { join } from 'path';
import * as schemas from './schemas';

export function getDatabaseFilePath() {
	return join(process.cwd(), env.server.DATABASE_URL);
}

const client = sqlite3(getDatabaseFilePath());
const db = drizzle(client, { schema: schemas });

export type Database = typeof db;
export { db };
