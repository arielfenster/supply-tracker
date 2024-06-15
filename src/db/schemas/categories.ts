import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { subcategories, users } from '.';

export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
});

export const categoryRelations = relations(categories, ({ many }) => ({
	subcategories: many(subcategories),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
