import { z } from 'zod';

export const addCategorySchema = z.object({
	name: z.string().min(1),
});

export type AddCategoryInput = z.infer<typeof addCategorySchema>;
