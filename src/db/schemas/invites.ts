import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';
import { users } from './users';

export const inviteStatus = ['Pending', 'Declined', 'Active'] as const;
// export const InviteStatus = {
// 	PENDING: 'Pending',
// 	DECLINED: 'Declined',
// 	ACTIVE: 'Active',
// } as const;

// const values = Object.values(InviteStatus) as any as readonly [
// 	(typeof InviteStatus)[keyof typeof InviteStatus],
// 	...(typeof InviteStatus)[keyof typeof InviteStatus][],
// ];

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
		.references(() => users.id, { onDelete: 'cascade' }),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventories.id),
	status: text('status', { enum: inviteStatus }).notNull().default('Pending'),

	createdAt: text('createdAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
});

export const inviteRelations = relations(invites, ({ one }) => ({
	sender: one(users, {
		fields: [invites.senderId],
		references: [users.id],
	}),
	inventory: one(inventories, {
		fields: [invites.inventoryId],
		references: [inventories.id],
	}),
}));

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
