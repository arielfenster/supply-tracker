import { getInventoryMembers } from '$/data-access/inventories';
import {
	AcceptInvitePayload,
	acceptInvite,
	createInvite,
	declineInvite,
	getInviteById,
} from '$/data-access/invites';
import { deleteUser, getUserByEmail } from '$/data-access/users';
import { InviteStatus, UserRole } from '$/db/schemas';
import { getCurrentUser } from '$/lib/auth';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { hashPassword } from './auth/password.service';
import { setSessionCookie } from './auth/session.service';
import { sendInviteEmail } from './email.service';
import { generateTempUserId, generateTempUserPassword, isTempUserId } from './users.service';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const recipient = await assertRecipientNotInventoryMember(data);
	const currentUser = await getCurrentUser();

	const invite = await createInvite({
		recipientId: recipient?.id ?? generateTempUserId(),
		senderId: currentUser!.id,
		inventoryId: data.inventoryId,
		token: randomUUID(),
		email: data.email,
		password: recipient?.id ? '' : await hashPassword(generateTempUserPassword()),
	});

	if (invite) {
		await sendInviteEmail(invite);
	}
}

async function assertRecipientNotInventoryMember(data: InviteMemberInput) {
	const { email, inventoryId } = data;

	const recipient = await getUserByEmail(email);
	if (!recipient) {
		return;
	}

	const inventoryMembers = await getInventoryMembers(inventoryId);
	const existingMember = inventoryMembers.find((member) => member.user.id === recipient.id);

	if (existingMember?.status === InviteStatus.ACTIVE || existingMember?.role === UserRole.OWNER) {
		throw new Error(`${email} is already a member of this inventory`);
	} else if (existingMember?.status === InviteStatus.PENDING) {
		throw new Error(`${email} already has a pending invite`);
	}

	return recipient;
}

export async function declineInviteUseCase(inviteId: string) {
	const invite = await getInviteById(inviteId);
	if (!invite) {
		return;
	}

	await declineInvite(inviteId);

	const isNewUser = isTempUserId(invite.recipientId);
	if (isNewUser) {
		// delete the temp user which will also delete the invite entry
		await deleteUser(invite.recipientId);
	}
}

export async function acceptInviteUseCase(data: AcceptInviteInput) {
	const { inviteId, password } = data;

	const invite = await getInviteById(inviteId);
	if (!invite) {
		return;
	}

	const payload: AcceptInvitePayload = {
		inviteId: invite.id,
		recipientId: invite.recipientId,
	};

	const isNewUser = isTempUserId(invite.recipientId);
	if (isNewUser) {
		payload.newUserId = nanoid();
		payload.newUserPassword = await hashPassword(password!);
	}

	await acceptInvite(payload);

	setSessionCookie(isNewUser ? payload.newUserId! : payload!.recipientId);
}
