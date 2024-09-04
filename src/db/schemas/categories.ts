import { relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { subcategories, users } from '.';

export const categories = sqliteTable('categories', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
	subcategories: many(subcategories),
	users: one(users, {
		fields: [categories.userId],
		references: [users.id],
	}),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
