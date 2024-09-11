import { z } from 'zod';

export const deleteCategorySchema = z.object({
	id: z.string(),
});

export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
