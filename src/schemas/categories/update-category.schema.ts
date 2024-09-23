import { z } from 'zod';
import { createCategorySchema } from './create-category.schema';

export const updateCategorySchema = createCategorySchema.extend({
	id: z.string(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
