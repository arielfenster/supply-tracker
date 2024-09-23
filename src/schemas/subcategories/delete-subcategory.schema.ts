import { z } from 'zod';

export const deleteSubcategorySchema = z.object({
	id: z.string(),
});

export type DeleteSubcategoryInput = z.infer<typeof deleteSubcategorySchema>;
