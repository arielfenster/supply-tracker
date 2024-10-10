import { createInvitation } from '$/data-access/invites';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { hashPassword } from './auth/password.service';
import { sendInvitationEmail } from './email.service';

const GUEST_USER_ID = 'GUEST_USER_ID';
const GUEST_USER_PASSWORD = 'GUEST_USER_PASSWORD';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const { email, inventoryId } = data;

	const invitation = await createInvitation({
		id: GUEST_USER_ID,
		email,
		password: await hashPassword(GUEST_USER_PASSWORD),
		inventoryId,
	});

	// TODO: implement -__-
	await sendInvitationEmail(invitation);
}
