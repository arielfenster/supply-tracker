import { z } from 'zod';
import { addSubcategorySchema } from './add-subcategory.schema';

export const updateSubcategorySchema = addSubcategorySchema.omit({ categoryId: true }).extend({
	id: z.string(),
});

export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
