import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { categories, items } from '.';

export const subcategories = sqliteTable('subcategories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').unique().notNull(),
	categoryId: text('categoryId')
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),
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
