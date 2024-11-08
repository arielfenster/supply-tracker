'use client';

import { Badge } from '$/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '$/components/ui/table';
import { InviteStatus, UserRole } from '$/db/schemas';
import { cn } from '$/lib/utils';
import { ManagePageProviderValue, useManagePageContext } from '../context';
import { ActionsDropdownMenu } from './table-actions-menu';
import {
	TableEntryData,
	buildTableEntriesFromMembersArray,
	buildTableEntriesFromPendingInvitesArray,
} from './utils';

export function InventoryMembersTable() {
	const { members, currentMember, pendingInvites, inventory } = useManagePageContext();
	const isCurrentMemberInventoryOwner = currentMember.role === UserRole.OWNER;

	const membersTableEntries = buildTableEntriesFromMembersArray(members, inventory.id);
	const invitesTableEntries = buildTableEntriesFromPendingInvitesArray(
		pendingInvites,
		inventory.id,
	);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					{isCurrentMemberInventoryOwner && <TableHead>Actions</TableHead>}
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...membersTableEntries, ...invitesTableEntries].map((item) => (
					<TableEntry
						key={item.id}
						item={item}
						currentMember={currentMember}
						isCurrentMemberInventoryOwner={isCurrentMemberInventoryOwner}
					/>
				))}
			</TableBody>
		</Table>
	);
}

function TableEntry({
	item,
	currentMember,
	isCurrentMemberInventoryOwner,
}: {
	item: TableEntryData;
	currentMember: ManagePageProviderValue['currentMember'];
	isCurrentMemberInventoryOwner: boolean;
}) {
	return (
		<TableRow key={item.id} className={cn(item.user.id === currentMember.user.id && 'bg-gray-200')}>
			<TableCell>{item.user.email}</TableCell>
			<TableCell>
				{item.user.firstName} {item.user.lastName}
			</TableCell>
			<TableCell>{item.user.role}</TableCell>
			<TableCell>
				<Badge
					variant={
						item.user.role === UserRole.OWNER || item.user.status === InviteStatus.ACTIVE
							? 'default'
							: 'secondary'
					}
				>
					{item.user.status}
				</Badge>
			</TableCell>
			<TableCell>
				{isCurrentMemberInventoryOwner && item.user.id !== currentMember.user.id && (
					<ActionsDropdownMenu
						member={item.user}
						role={item.user.role}
						inventoryId={item.inventoryId}
					/>
				)}
			</TableCell>
		</TableRow>
	);
}
