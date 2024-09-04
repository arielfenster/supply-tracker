import { relations } from 'drizzle-orm';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { categories } from '.';

export const users = sqliteTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		email: text('email', { length: 255 }).notNull(),
		password: text('password').notNull(),
	},
	(users) => {
		return {
			uniqueEmail: uniqueIndex('email_index').on(users.email),
		};
	},
);

export const userRelations = relations(users, ({ many }) => ({
	categories: many(categories),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
