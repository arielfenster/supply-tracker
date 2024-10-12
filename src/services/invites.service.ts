import { acceptInvitation, createInvitation, declineInvitation } from '$/data-access/invites';
import { getCurrentUser } from '$/lib/auth';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInvitationInput } from '$/schemas/invites/accept-invitation.schema';
import { randomUUID } from 'crypto';
import { hashPassword } from './auth/password.service';
import { setSessionCookie } from './auth/session.service';
import { sendInvitationEmail } from './email.service';

const TEMP_USER_PASSWORD = 'TEMP_USER_PASSWORD';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const currentUser = await getCurrentUser();

	const invitation = await createInvitation({
		email: data.email,
		password: await hashPassword(TEMP_USER_PASSWORD),
		inventoryId: data.inventoryId,
		token: randomUUID(),
		senderId: currentUser!.id,
	});

	// TODO: implement -__-
	if (invitation) {
		await sendInvitationEmail(invitation);
	}
}

export async function declineInviteUseCase(inviteId: string) {
	await declineInvitation(inviteId);
}

export async function acceptInviteUseCase(data: AcceptInvitationInput) {
	const invitation = await acceptInvitation({
		invitationId: data.invitationId,
		newUserPassword: await hashPassword(data.password),
	});

	setSessionCookie(invitation!.recipientId);
}
