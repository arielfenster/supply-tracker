import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categories, items, users } from '.';

export const subcategories = sqliteTable('subcategories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	categoryId: text('categoryId')
		.notNull()
		.references(() => categories.id),
});

export const subcategoryRelations = relations(subcategories, ({ one, many }) => ({
	categories: one(categories, {
		fields: [subcategories.categoryId],
		references: [categories.id],
	}),
	items: many(items),
}));

export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;
