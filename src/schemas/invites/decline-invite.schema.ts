import { z } from 'zod';

export const declineInviteSchema = z.object({
	inviteId: z.string(),
});

export type DeclineInviteInput = z.infer<typeof declineInviteSchema>;
