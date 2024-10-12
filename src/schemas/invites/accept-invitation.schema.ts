import { z } from 'zod';
import { passwordSchema } from '../auth/password.schema';
import { declineInvitationSchema } from './decline-invitation.schema';

export const acceptInvitationSchema = declineInvitationSchema
	.pick({
		invitationId: true,
	})
	.extend({
		password: passwordSchema,
	});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
