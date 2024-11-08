import { InviteStatus, UserRole } from '$/db/schemas';
import { ManagePageProviderValue } from '../context';

export type TableEntryData = {
	id: string;
	inventoryId: string;
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		role: UserRole;
		status: InviteStatus;
	};
};

export function buildTableEntriesFromMembersArray(
	members: ManagePageProviderValue['members'],
	inventoryId: string,
): TableEntryData[] {
	return members.map(({ user, role }) => ({
		id: user.id,
		inventoryId,
		user: {
			id: user.id,
			firstName: user.firstName ?? 'Ariel',
			lastName: user.lastName ?? 'Fenster',
			email: user.email,
			role,
			status: InviteStatus.ACTIVE,
		},
	}));
}

export function buildTableEntriesFromPendingInvitesArray(
	invites: ManagePageProviderValue['pendingInvites'],
	inventoryId: string,
): TableEntryData[] {
	return invites.map(({ invite, recipient, role }) => ({
		id: invite.id,
		inventoryId,
		user: {
			id: recipient.id,
			firstName: recipient.firstName ?? 'Ariel',
			lastName: recipient.lastName ?? 'Fenster',
			email: recipient.email,
			role,
			status: InviteStatus.PENDING,
		},
	}));
}
