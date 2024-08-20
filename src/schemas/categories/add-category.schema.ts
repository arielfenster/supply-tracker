import { z } from 'zod';

export const addCategorySchema = z.object({
	category: z.string().min(1),
});

export type AddCategoryInput = z.infer<typeof addCategorySchema>;
