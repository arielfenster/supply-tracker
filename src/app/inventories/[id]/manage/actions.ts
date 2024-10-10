'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { ServerActionState } from '$/lib/types';
import { InviteMemberInput, inviteMemberSchema } from '$/schemas/inventories/invite-member.schema';
import { inviteMemberUseCase } from '$/services/invites.service';

export async function inviteMemberAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = inviteMemberSchema.parse(formDataToObject<InviteMemberInput>(formData));
		await inviteMemberUseCase(data);

		return {
			success: true,
			message: `Sent an invitation to ${data.email}`,
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
