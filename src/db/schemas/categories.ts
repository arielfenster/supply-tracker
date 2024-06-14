import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { users } from '.';

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
