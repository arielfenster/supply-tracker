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
import { InventoryMember } from '$/data-access/inventories';
import { EllipsisVertical, TrashIcon } from 'lucide-react';

interface InventoryMembersTableProps {
	members: InventoryMember[];
	currentMember: InventoryMember;
}

export function InventoryMembersTable({ members, currentMember }: InventoryMembersTableProps) {
	const isCurrentMemberInventoryOwner = currentMember.role === 'Owner';

	// TODO: show a "thats you"/highlighted row for the current member

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
					<TableRow key={member.user.id}>
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
			</TableBody>
		</Table>
	);
}
