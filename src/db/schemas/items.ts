import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { subcategories, users } from '.';

export const items = sqliteTable('items', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	warningThreshold: integer('warningThreshold').notNull().default(1),
	dangerThreshold: integer('dangerThreshold').notNull().default(0),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	subcategoryId: text('subcategoryId')
		.notNull()
		.references(() => subcategories.id),
});

export const itemRelations = relations(items, ({ one }) => ({
	subcategories: one(subcategories, {
		fields: [items.subcategoryId],
		references: [subcategories.id],
	}),
}));

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
