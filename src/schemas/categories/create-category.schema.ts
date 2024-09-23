import { z } from 'zod';

export const createCategorySchema = z.object({
	name: z.string().min(1),
	inventoryId: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
