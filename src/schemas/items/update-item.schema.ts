import { z } from 'zod';
import { createItemSchema } from './create-item.schema';

export const updateItemSchema = createItemSchema
	.innerType()
	.extend({
		id: z.string(),
	})
	.superRefine((values, ctx) => {
		const { measurement, quantity, warningThreshold, dangerThreshold } = values;

		const isValidQuantity = !Number.isNaN(Number(quantity)) && Number(quantity) > 0;

		if (measurement !== 'Custom' && !isValidQuantity) {
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
