import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subcategories, users } from '.';
import { nanoid } from 'nanoid';

export const categories = sqliteTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
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
