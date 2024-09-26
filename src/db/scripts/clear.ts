import { env } from '$/lib/env';
import sqlite3 from 'better-sqlite3';
import * as fs from 'fs';

function main() {
	// delete the db file
	fs.unlinkSync(env.server.DATABASE_URL);

	// instantiate a client will create a new file
	sqlite3(env.server.DATABASE_URL);
}

main();
