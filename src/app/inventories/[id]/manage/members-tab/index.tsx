'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$/components/ui/card';
import { useManagePageContext } from '../context';
import { InventoryMembersTable } from './inventory-members-table';
import { InviteMemberForm } from './invite-member-form';

export function MembersTab() {
	const { currentMember } = useManagePageContext();

	return (
		<div className='flex flex-col gap-6'>
			{currentMember.role === 'Owner' && (
				<Card>
					<CardHeader>
						<CardTitle>Invite New Member</CardTitle>
						<CardDescription>Invite a new member to collaborate on this inventory</CardDescription>
					</CardHeader>
					<CardContent>
						<InviteMemberForm />
					</CardContent>
				</Card>
			)}
			<Card>
				<CardHeader>
					<CardTitle>Members and Invitations</CardTitle>
					<CardDescription>Manage inventory access and pending invitations</CardDescription>
				</CardHeader>
				<CardContent>
					<InventoryMembersTable />
				</CardContent>
			</Card>
		</div>
	);
}
