import { z } from 'zod';
import { createItemSchema } from './create-item.schema';

export const updateItemSchema = createItemSchema
	.innerType()
	.omit({ subcategoryId: true })
	.extend({
		id: z.string(),
	})
	.superRefine((values, ctx) => {
		const { measurement, quantity, warningThreshold, dangerThreshold } = values;

		if (measurement !== 'Custom' && Number.isNaN(Number(quantity))) {
			ctx.addIssue({
				code: 'custom',
				path: ['quantity'],
				message: 'For non-custom measurements, quantity must be non-negative number',
			});
		}

		if (warningThreshold < dangerThreshold) {
			ctx.addIssue({
				code: 'custom',
				path: ['dangerThreshold'],
				message: 'Danger threshold cannot be higher than warning threshold',
			});
		}
	});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;
