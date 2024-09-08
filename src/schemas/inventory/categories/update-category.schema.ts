import { z } from 'zod';
import { addCategorySchema } from './add-category.schema';

export const updateCategorySchema = addCategorySchema.extend({
	id: z.string(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
