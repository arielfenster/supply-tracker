import { z } from 'zod';

export const createInventorySchema = z.object({
	name: z.string().min(2),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
