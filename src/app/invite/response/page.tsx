import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$/components/ui/card';
import { getInviteByToken } from '$/data-access/invites';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { redirect } from 'next/navigation';
import { InviteResponseForm } from './invite-response-form';
import { isTempUserId } from '$/services/users.service';

type SearchParams = {
	token: string;
};

export default async function InviteResponsePage({ searchParams }: PageParams<{}, SearchParams>) {
	const { token } = searchParams;

	const invite = await getInviteByToken(token);
	if (!invite) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const isNewUser = isTempUserId(invite.recipientId);

	return (
		<main className='h-screen flex items-center'>
			<Card className='max-w-lg mx-auto'>
				<CardHeader>
					<CardTitle>Inventory Invitation</CardTitle>
					<CardDescription>
						You have been invited by {invite.sender.email} to join his {invite.inventory.name}{' '}
						inventory. Would you like to accept or decline?
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InviteResponseForm
						inviteId={invite.id}
						inventoryId={invite.inventoryId}
						isNewUser={isNewUser}
					/>
				</CardContent>
			</Card>
		</main>
	);
}
