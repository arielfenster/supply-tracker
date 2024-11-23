import { getCurrentTimestamp } from '$/data-access/utils';
import { objectValues } from '$/lib/utils';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';
import { users } from './users';

export const InviteStatus = {
	PENDING: 'Pending',
	DECLINED: 'Declined',
	ACTIVE: 'Active',
} as const;
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];

export const invites = pgTable('invites', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	token: varchar('token'),
	senderId: varchar('senderId')
		.notNull()
		.references(() => users.id),
	recipientId: varchar('recipientId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	inventoryId: varchar('inventoryId')
		.notNull()
		.references(() => inventories.id),
	status: varchar('status', { enum: objectValues(InviteStatus) })
		.notNull()
		.default('Pending'),

	createdAt: varchar('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: varchar('updatedAt')
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
