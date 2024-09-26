import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { subcategories } from './subcategories';

export const items = sqliteTable('items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	warningThreshold: integer('warningThreshold').notNull().default(1),
	dangerThreshold: integer('dangerThreshold').notNull().default(0),
	subcategoryId: text('subcategoryId')
		.notNull()
		.references(() => subcategories.id, { onDelete: 'cascade' }),

	createdAt: text('createdAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`),
});

export const itemRelations = relations(items, ({ one }) => ({
	subcategories: one(subcategories, {
		fields: [items.subcategoryId],
		references: [subcategories.id],
	}),
}));

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
