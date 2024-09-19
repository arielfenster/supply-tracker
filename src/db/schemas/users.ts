import { relations } from 'drizzle-orm';
import { pgTable, text, varchar, uniqueIndex } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { categories } from '.';

export const users = pgTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		email: varchar('email', { length: 255 }).notNull(),
		password: text('password').notNull(),
		firstName: text('firstName'),
		lastName: text('lastName'),
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
