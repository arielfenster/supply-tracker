import { z } from 'zod';
import { createSubcategorySchema } from './create-subcategory.schema';

export const updateSubcategorySchema = createSubcategorySchema.extend({
	id: z.string(),
});

export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
