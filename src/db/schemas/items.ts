import { getCurrentTimestamp } from '$/data-access/utils';
import { relations } from 'drizzle-orm';
import { real, pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { subcategories } from './subcategories';

export const measurementUnits = ['Gram', 'Kg', 'Liter', 'Cup', 'Piece', 'Bag', 'Custom'] as const;

export const items = pgTable('items', {
	id: varchar('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name').notNull(),
	quantity: varchar('quantity').notNull(),
	measurement: varchar('measurement', { enum: measurementUnits }).notNull(),
	warningThreshold: real('warningThreshold').notNull().default(1),
	dangerThreshold: real('dangerThreshold').notNull().default(0),
	subcategoryId: varchar('subcategoryId')
		.notNull()
		.references(() => subcategories.id, { onDelete: 'cascade' }),

	createdAt: varchar('createdAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
	updatedAt: varchar('updatedAt')
		.notNull()
		.$defaultFn(() => getCurrentTimestamp()),
});

export const itemRelations = relations(items, ({ one }) => ({
	subcategories: one(subcategories, {
		fields: [items.subcategoryId],
		references: [subcategories.id],
	}),
}));

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
