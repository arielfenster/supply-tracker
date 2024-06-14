import * as schemas from './schemas';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const db = drizzle(postgres({}), { schema: schemas });

export type Database = typeof db;
export { db };

// db.query.categories.findFirst({
// 	where({id, name, userId}, operators) {
// 	},
// 	with: {}
// })

// db.query.items.findFirst({
// 	where({category, categoryId, userId}, operators) {
// 	},
// 	with: {}
// })

// db.query.users.findFirst({
// 	with: {
// 		categories: true,
// 		items: true,
// 	},
// 	where({email, id, password}, operators) {
		
// 	},
// })