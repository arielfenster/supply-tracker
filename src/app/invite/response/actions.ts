'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ServerActionState } from '$/lib/types';
import { AcceptInviteInput, acceptInviteSchema } from '$/schemas/invites/accept-invite.schema';
import {
	DeclineInviteInput,
	declineInviteSchema,
} from '$/schemas/invites/decline-invite.schema';
import { acceptInviteUseCase, declineInviteUseCase } from '$/services/invites.service';

export async function acceptInviteAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = acceptInviteSchema.parse(formDataToObject<AcceptInviteInput>(formData));
		await acceptInviteUseCase(data);

		return {
			success: true,
			message: 'Invitation accepted',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function declineInviteAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = declineInviteSchema.parse(formDataToObject<DeclineInviteInput>(formData));
		await declineInviteUseCase(data.inviteId);

		return {
			success: true,
			message: 'Invitation declined',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
