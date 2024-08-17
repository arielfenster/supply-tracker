import { relations } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { categories, items } from '.';
import { nanoid } from 'nanoid';

export const users = pgTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		email: varchar('email', { length: 255 }).notNull(),
		password: text('password').notNull(),
	},
	(users) => {
		return {
			uniqueEmail: uniqueIndex('email_index').on(users.email),
		};
	},
);

export const userRelations = relations(users, ({ many }) => ({
	items: many(items),
	categories: many(categories),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
