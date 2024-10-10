import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories, usersToInventories } from './inventories';
import { users } from './users';

export const inviteStatus = ['pending', 'declined', 'active'] as const;

export const invites = sqliteTable('invites', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	token: text('token').notNull().unique(),
	recipientId: text('recipientId')
		.notNull()
		.references(() => users.id),
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

// export const inviteRelations = relations(invites, ({ one, many }) => ({
	// usersToInventories: many(usersToInventories),
	// inventory: one(inventories, {
	// 	fields: [invites.inventoryId],
	// 	references: [inventories.id],
	// }),
// }));

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
