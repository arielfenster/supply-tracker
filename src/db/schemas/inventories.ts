import { getCurrentTimestamp } from '$/data-access/utils';
import { objectValues } from '$/lib/utils';
import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { categories, users } from '.';

export const inventories = sqliteTable('inventories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	ownerId: text('ownerId')
		.notNull()
		.references(() => users.id),

	createdAt: text('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: text('updatedAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
});

export const inventoryRelations = relations(inventories, ({ one, many }) => ({
	owner: one(users, {
		fields: [inventories.ownerId],
		references: [users.id],
	}),
	usersToInventories: many(usersToInventories),
	categories: many(categories),
}));

export type Inventory = typeof inventories.$inferSelect;
export type NewInventory = typeof inventories.$inferInsert;

export const UserRole = {
	OWNER: 'Owner',
	EDITOR: 'Editor',
	VIEWER: 'Viewer',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const usersToInventories = sqliteTable(
	'usersToInventories',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		inventoryId: text('inventoryId')
			.notNull()
			.references(() => inventories.id, { onDelete: 'cascade' }),
		role: text('role', { enum: objectValues(UserRole) })
			.notNull()
			.default('Viewer'),

		createdAt: text('createdAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
		updatedAt: text('updatedAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.inventoryId] }),
	}),
);

export type UsersToInventories = typeof usersToInventories.$inferSelect;

export const usersToInventoriesRelations = relations(usersToInventories, ({ one }) => ({
	user: one(users, {
		fields: [usersToInventories.userId],
		references: [users.id],
	}),
	inventory: one(inventories, {
		fields: [usersToInventories.inventoryId],
		references: [inventories.id],
	}),
}));
