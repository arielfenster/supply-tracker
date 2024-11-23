import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { usersToInventories } from '.';

export const weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const;

export const users = pgTable(
	'users',
	{
		id: varchar('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		email: varchar('email', { length: 255 }).notNull(),
		password: varchar('password').notNull(),
		firstName: varchar('firstName'),
		lastName: varchar('lastName'),
		notificationsDay: varchar('notificationsDay', {
			enum: weekDays,
		}),
		notificationsTime: varchar('notificationsTime'),

		createdAt: varchar('createdAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
		updatedAt: varchar('updatedAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
	},
	(table) => {
		return {
			uniqueEmail: uniqueIndex('email_index').on(table.email),
		};
	},
);

export const userRelations = relations(users, ({ many }) => ({
	usersToInventories: many(usersToInventories),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
