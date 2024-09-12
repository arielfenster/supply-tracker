import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { subcategories, users } from '.';
import { nanoid } from 'nanoid';

export const items = pgTable('items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	warningThreshold: integer('warningThreshold').notNull().default(1),
	dangerThreshold: integer('dangerThreshold').notNull().default(0),
	// userId: text('userId')
	// 	.notNull()
	// 	.references(() => users.id),
	subcategoryId: text('subcategoryId')
		.notNull()
		.references(() => subcategories.id, { onDelete: 'cascade' }),
});

export const itemRelations = relations(items, ({ one }) => ({
	subcategories: one(subcategories, {
		fields: [items.subcategoryId],
		references: [subcategories.id],
	}),
}));

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
