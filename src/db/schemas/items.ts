import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { subcategories, users } from '.';

export const items = pgTable('items', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull(),
	warningThreshold: integer('warningThreshold').default(1),
	dangerThreshold: integer('dangerThreshold').default(0),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	subcategoryId: text('subcategoryId')
		.notNull()
		.references(() => subcategories.id),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
