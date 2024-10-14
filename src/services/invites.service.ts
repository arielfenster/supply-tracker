import { acceptInvite, createInvite, declineInvite } from '$/data-access/invites';
import { getCurrentUser } from '$/lib/auth';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { randomUUID } from 'crypto';
import { hashPassword } from './auth/password.service';
import { setSessionCookie } from './auth/session.service';
import { sendInviteEmail } from './email.service';

const TEMP_USER_PASSWORD = 'TEMP_USER_PASSWORD';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const currentUser = await getCurrentUser();

	const invite = await createInvite({
		email: data.email,
		password: await hashPassword(TEMP_USER_PASSWORD),
		inventoryId: data.inventoryId,
		token: randomUUID(),
		senderId: currentUser!.id,
	});

	// TODO: implement -__-
	if (invite) {
		await sendInviteEmail(invite);
	}
}

export async function declineInviteUseCase(inviteId: string) {
	await declineInvite(inviteId);
}

export async function acceptInviteUseCase(data: AcceptInviteInput) {
	const invite = await acceptInvite({
		inviteId: data.inviteId,
		newUserPassword: await hashPassword(data.password),
	});

	setSessionCookie(invite!.recipientId);
}
