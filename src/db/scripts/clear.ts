import { sql } from "drizzle-orm";
import { client, db } from "../db";

async function main() {
	if (!db._.schema) {
		console.log('No db schema. aborting')
		return;
	}

	await db.execute(sql.raw('DROP SCHEMA IF EXISTS "public" CASCADE;'));
	await db.execute(sql.raw('CREATE SCHEMA public;'));

	await client.end();
}

main();
