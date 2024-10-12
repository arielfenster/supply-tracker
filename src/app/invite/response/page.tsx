import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$/components/ui/card';
import { getInvitationByToken } from '$/data-access/invites';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { redirect } from 'next/navigation';
import { InvitationResponseForm } from './invitation-response-form';

type SearchParams = {
	token: string;
};

export default async function AcceptInvitePage({ searchParams }: PageParams<{}, SearchParams>) {
	const { token } = searchParams;

	const invitation = await getInvitationByToken(token);

	if (!invitation) {
		redirect(AppRoutes.AUTH.SIGNUP);
	}

	return (
		<main className='h-screen flex items-center'>
			<Card className='max-w-lg mx-auto'>
				<CardHeader>
					<CardTitle>Inventory Invitation</CardTitle>
					<CardDescription>
						You have been invited by {invitation.sender.email} to join his{' '}
						{invitation.inventory.name} inventory. Would you like to accept or decline?
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InvitationResponseForm
						invitationId={invitation.id}
						inventoryId={invitation.inventoryId}
					/>
				</CardContent>
			</Card>
		</main>
	);
}
