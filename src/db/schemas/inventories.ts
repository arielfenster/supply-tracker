import { getCurrentTimestamp } from '$/data-access/utils';
import { objectValues } from '$/lib/utils';
import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { categories, users } from '.';

export const inventories = pgTable('inventories', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name').notNull(),
	ownerId: varchar('ownerId')
		.notNull()
		.references(() => users.id),

	createdAt: varchar('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: varchar('updatedAt')
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

export const usersToInventories = pgTable(
	'usersToInventories',
	{
		userId: varchar('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		inventoryId: varchar('inventoryId')
			.notNull()
			.references(() => inventories.id, { onDelete: 'cascade' }),
		role: varchar('role', { enum: objectValues(UserRole) })
			.notNull()
			.default('Viewer'),

		createdAt: varchar('createdAt')
			.notNull()
			.$defaultFn(() => getCurrentTimestamp()),
		updatedAt: varchar('updatedAt')
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
