import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';

export const inviteStatus = ['pending', 'declined', 'accepted'] as const;

export const invites = sqliteTable('invites', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	token: text('token').notNull().unique(),
	recipient: text('email', { length: 255 }).notNull(),
	status: text('status', { enum: inviteStatus }).default('pending'),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventories.id),

	createdAt: text('createdAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
});

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
