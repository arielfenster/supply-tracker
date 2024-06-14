import { integer, pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { categories, users } from '.';

export const items = pgTable('items', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	category: text('category').notNull(),
	quantity: integer('quantity').notNull(),
	warningThreshold: integer('warningThreshold').default(0),
	dangerThreshold: integer('dangerThreshold').default(0),
	userId: text('userId')
		.notNull()
		.references(() => users.id),
	categoryId: integer('categoryId')
		.notNull()
		.references(() => categories.id),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
