import { getCurrentTimestamp } from '$/data-access/utils';
import { objectValues } from '$/lib/utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';
import { users } from './users';

export const InviteStatus = {
	PENDING: 'Pending',
	DECLINED: 'Declined',
	ACTIVE: 'Active',
} as const;
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];

export const invites = sqliteTable('invites', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	token: text('token'),
	senderId: text('senderId')
		.notNull()
		.references(() => users.id),
	recipientId: text('recipientId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventories.id),
	status: text('status', { enum: objectValues(InviteStatus) })
		.notNull()
		.default('Pending'),

	createdAt: text('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: text('updatedAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
});

export const inviteRelations = relations(invites, ({ one }) => ({
	sender: one(users, {
		fields: [invites.senderId],
		references: [users.id],
		relationName: 'sender',
	}),
	recipient: one(users, {
		fields: [invites.recipientId],
		references: [users.id],
		relationName: 'recipient',
	}),
	inventory: one(inventories, {
		fields: [invites.inventoryId],
		references: [inventories.id],
	}),
}));

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
