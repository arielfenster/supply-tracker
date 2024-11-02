import { z } from 'zod';

export const moveItemSchema = z.object({
	itemId: z.string(),
	categoryId: z.string(),
	subcategoryId: z.string(),
});

export type MoveItemInput = z.infer<typeof moveItemSchema>;
