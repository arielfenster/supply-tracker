import { z } from 'zod';
import { createInventorySchema } from './create-inventory.schema';

export const updateInventorySchema = createInventorySchema
	.pick({
		name: true,
	})
	.extend({
		id: z.string(),
	});

export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
