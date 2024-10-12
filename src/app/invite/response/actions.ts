'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ServerActionState } from '$/lib/types';
import {
	AcceptInvitationInput,
	acceptInvitationSchema,
} from '$/schemas/invites/accept-invitation.schema';
import {
	DeclineInvitationInput,
	declineInvitationSchema,
} from '$/schemas/invites/decline-invitation.schema';
import { acceptInviteUseCase, declineInviteUseCase } from '$/services/invites.service';

export async function acceptInvitationAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = acceptInvitationSchema.parse(formDataToObject<AcceptInvitationInput>(formData));
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

export async function declineInvitationAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = declineInvitationSchema.parse(formDataToObject<DeclineInvitationInput>(formData));
		await declineInviteUseCase(data.invitationId);

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
