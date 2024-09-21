import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';

export const invites = sqliteTable('invites', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	token: text('token').notNull().unique(),
	recipient: text('email', { length: 255 }).notNull(),
	status: text('status', { enum: ['pending', 'decline', 'accepted'] }).default('pending'),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventories.id),
});

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
