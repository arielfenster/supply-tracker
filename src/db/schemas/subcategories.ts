import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { categories, items } from '.';

export const subcategories = pgTable('subcategories', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name').unique().notNull(),
	categoryId: varchar('categoryId')
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),

	createdAt: varchar('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: varchar('updatedAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
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
