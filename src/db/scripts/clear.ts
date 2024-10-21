import sqlite3 from 'better-sqlite3';
import * as fs from 'fs';
import { getDatabaseFilePath } from '../db';

function main() {
	const dbFilePath = getDatabaseFilePath();

	// delete the db file
	if (fs.existsSync(dbFilePath)) {
		fs.unlinkSync(dbFilePath);
	}

	// instantiate a client will create a new file
	sqlite3(dbFilePath);
}

main();
