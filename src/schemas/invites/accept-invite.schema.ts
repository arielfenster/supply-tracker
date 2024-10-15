import { z } from 'zod';
import { passwordSchema } from '../auth/password.schema';
import { declineInviteSchema } from './decline-invite.schema';

export const acceptInviteSchema = declineInviteSchema
	.pick({
		inviteId: true,
	})
	.extend({
		password: passwordSchema.optional(),
	});

export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
