import { z } from 'zod';

export const addSubcategorySchema = z.object({
	name: z.string().min(1),
	categoryId: z.string(),
});

export type AddSubcategoryInput = z.infer<typeof addSubcategorySchema>;
