import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { categories, users } from '.';

export const inventories = sqliteTable('inventories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
});

export const inventoryRelations = relations(inventories, ({ many }) => ({
	usersToInventories: many(usersToInventories),
	categories: many(categories),
}));

export type Inventory = typeof inventories.$inferSelect;
export type NewInventory = typeof inventories.$inferInsert;

export const usersToInventories = sqliteTable(
	'usersToInventories',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id),
		inventoryId: text('inventoryId')
			.notNull()
			.references(() => inventories.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId, table.inventoryId] }),
	}),
);

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
