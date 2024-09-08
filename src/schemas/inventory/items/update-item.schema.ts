import { z } from 'zod';
import { createItemSchema } from './create-item.schema';

export const updateItemSchema = createItemSchema
	.innerType()
	.omit({ subcategoryId: true })
	.extend({
		id: z.string(),
	})
	.superRefine((values, ctx) => {
		const { warningThreshold, dangerThreshold } = values;

		if (warningThreshold < dangerThreshold) {
			ctx.addIssue({
				code: 'custom',
				path: ['warningThreshold'],
				message: 'Warning threshold cannot be lower than danger threshold',
			});
		}
	});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
