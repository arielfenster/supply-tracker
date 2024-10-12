import { z } from 'zod';

export const declineInvitationSchema = z.object({
	invitationId: z.string(),
});

export type DeclineInvitationInput = z.infer<typeof declineInvitationSchema>;
