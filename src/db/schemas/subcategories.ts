import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { categories, items, users } from '.';
import { nanoid } from 'nanoid';

export const subcategories = pgTable('subcategories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').unique().notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
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
