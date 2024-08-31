import { z } from 'zod';

export const updateItemSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		quantity: z.coerce.number().positive(),
		warningThreshold: z.coerce.number().positive(),
		dangerThreshold: z.coerce.number().positive(),
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
