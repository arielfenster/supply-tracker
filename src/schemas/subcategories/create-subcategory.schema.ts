import { z } from 'zod';

export const createSubcategorySchema = z.object({
	name: z.string().min(1),
	categoryId: z.string(),
});

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
