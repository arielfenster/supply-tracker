import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { inventories } from './inventories';
import { subcategories } from './subcategories';

export const categories = pgTable('categories', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name').notNull(),
	inventoryId: varchar('inventoryId')
		.notNull()
		.references(() => inventories.id),

	createdAt: varchar('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: varchar('updatedAt')
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
