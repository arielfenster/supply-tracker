import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
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

export const users = sqliteTable(
	'users',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		email: text('email', { length: 255 }).notNull(),
		password: text('password').notNull(),
		firstName: text('firstName'),
		lastName: text('lastName'),
		notificationsDay: text('notificationsDay', {
			enum: weekDays,
		}),
		notificationsTime: text('notificationsTime'),

		createdAt: text('createdAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
		updatedAt: text('updatedAt')
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
