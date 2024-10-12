'use client';

import { Button } from '$/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '$/components/ui/table';
import { EllipsisVertical, TrashIcon } from 'lucide-react';
import { useManagePageContext } from '../context';
import { cn } from '$/lib/utils';

export function InventoryMembersTable() {
	const { members, currentMember, pendingInvitations } = useManagePageContext();

	const isCurrentMemberInventoryOwner = currentMember.role === 'Owner';

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					{isCurrentMemberInventoryOwner && <TableHead>Actions</TableHead>}
				</TableRow>
			</TableHeader>
			<TableBody>
				{members.map((member) => (
					<TableRow
						key={member.user.id}
						className={cn(member.user.id === currentMember.user.id && 'bg-gray-200')}
					>
						<TableCell>
							{member.user.firstName} {member.user.lastName}
						</TableCell>
						<TableCell>{member.user.email}</TableCell>
						<TableCell>{member.role}</TableCell>
						<TableCell>{member.role === 'Owner' ? 'Active' : member.status}</TableCell>
						{isCurrentMemberInventoryOwner && member.user.id !== currentMember.user.id && (
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<EllipsisVertical />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem>
											<Button>Change role</Button>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<TrashIcon />
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						)}
					</TableRow>
				))}
				{pendingInvitations.map((invitation) => (
					<TableRow key={invitation.id}>
						<TableCell>
							{invitation.recipient.firstName} {invitation.recipient.lastName}
						</TableCell>
						<TableCell>{invitation.recipient.email}</TableCell>
						<TableCell>Viewer</TableCell>
						<TableCell>{invitation.status}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
