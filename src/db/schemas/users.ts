import { relations } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { categories, items } from '.';

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey(),
		email: varchar('email', { length: 255 }).notNull(),
		password: text('password').notNull(),
	},
	(users) => {
		return {
			uniqueEmail: uniqueIndex('email_index').on(users.email),
		};
	},
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userRelations = relations(users, ({ many }) => ({
	items: many(items),
	categories: many(categories),
}));
