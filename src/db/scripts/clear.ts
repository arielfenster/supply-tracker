import { env } from '$/lib/env';
import { createClient } from '@libsql/client';
import * as fs from 'fs';

function main() {
	// delete the db file
	if (fs.existsSync(env.server.DATABASE_URL)) {
		fs.unlinkSync(env.server.DATABASE_URL);
	}

	// instantiate a client will create a new file
	createClient({
		url: `file:${env.server.DATABASE_URL}`,
		authToken: env.server.DATABASE_AUTH_TOKEN,
	});
}

main();
