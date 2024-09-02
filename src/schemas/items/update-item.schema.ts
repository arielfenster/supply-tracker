import { z } from 'zod';
import { createItemSchema } from './create-item.schema';

export const updateItemSchema = createItemSchema.innerType().omit({ subcategoryId: true }).extend({
	id: z.string(),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
