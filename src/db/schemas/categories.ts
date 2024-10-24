import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';
import { subcategories } from './subcategories';

export const categories = sqliteTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	inventoryId: text('inventoryId')
		.notNull()
		.references(() => inventories.id),

	createdAt: text('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: text('updatedAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
	subcategories: many(subcategories),
	inventories: one(inventories, {
		fields: [categories.inventoryId],
		references: [inventories.id],
	}),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
