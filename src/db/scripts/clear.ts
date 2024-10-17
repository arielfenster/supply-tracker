import { IS_PROD, env } from '$/lib/env';
import { createClient } from '@libsql/client';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import { db, getLocalFileUrl } from '../db';

async function main() {
	if (IS_PROD) {
		await db.run(sql`DROP TABLE IF EXISTS "users"`);
		await db.run(sql`DROP TABLE IF EXISTS "usersToInventories"`);
		await db.run(sql`DROP TABLE IF EXISTS "inventories"`);
		await db.run(sql`DROP TABLE IF EXISTS "invites"`);
		await db.run(sql`DROP TABLE IF EXISTS "categories"`);
		await db.run(sql`DROP TABLE IF EXISTS "subcategories"`);
		await db.run(sql`DROP TABLE IF EXISTS "items"`);
	} else {
		// delete the db file
		if (fs.existsSync(env.server.DATABASE_URL)) {
			fs.unlinkSync(env.server.DATABASE_URL);
		}

		// instantiate a client will create a new file
		createClient({
			url: getLocalFileUrl(),
			authToken: env.server.DATABASE_AUTH_TOKEN,
		});
	}
}

main();
