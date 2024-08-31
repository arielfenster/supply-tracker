import { z } from 'zod';

export const updateItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		quantity: z.number().positive(),
		warningThreshold: z.number().positive(),
		dangerThreshold: z.number().positive(),
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
