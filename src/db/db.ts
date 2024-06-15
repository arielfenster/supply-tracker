import * as schemas from './schemas';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const db = drizzle(postgres(process.env.DATABASE_URL as string), { schema: schemas });

export type Database = typeof db;
export { db };
