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
import { InviteStatus, UserRole } from '$/db/schemas';
import { Badge } from '$/components/ui/badge';

export function InventoryMembersTable() {
	const { members, currentMember } = useManagePageContext();

	const isCurrentMemberInventoryOwner = currentMember.role === UserRole.OWNER;

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
						<TableCell>
							<Badge
								variant={
									member.role === UserRole.OWNER || member.status === InviteStatus.ACTIVE
										? 'default'
										: 'secondary'
								}
							>
								{member.role === UserRole.OWNER ? InviteStatus.ACTIVE : member.status}
							</Badge>
						</TableCell>
						{/* {isCurrentMemberInventoryOwner && member.user.id !== currentMember.user.id && (
							<TableCell>
								<ActionsDropdownMenu member={member} status={status} />
							</TableCell>
						)} */}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}


// function ActionsDropdownMenu({
// 	member,
// 	status,
// }: {
// 	member: InventoryMember;
// 	status: InviteStatus;
// }) {
// 	const [isAlertDialogOpen, setIsAlreadyDialogOpen] = useState(false);
// 	const isRemoveMemberAction = status === InviteStatus.ACTIVE;

// 	return (
// 		<DropdownMenu>
// 			<DropdownMenuTrigger asChild>
// 				<EllipsisVertical />
// 			</DropdownMenuTrigger>
// 			<DropdownMenuContent className='w-36'>
// 				<DropdownMenuItem className='flex justify-between'>
// 					<span>Change role</span>
// 					<PenIcon />
// 				</DropdownMenuItem>
// 				<DropdownMenuItem className='flex justify-between'>
// 					<AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlreadyDialogOpen}>
// 						<AlertDialogTrigger
// 							asChild
// 							// onClick={(e) => {
// 							// 	console.log('hello');
// 							// 	e.stopPropagation();
// 							// }}
// 						>
// 							<div className='flex justify-between w-full'>
// 								<span>Delete</span>
// 								<TrashIcon />
// 							</div>
// 						</AlertDialogTrigger>
// 						<AlertDialogContent>
// 							<AlertDialogHeader>
// 								<AlertDialogTitle>
// 									{isRemoveMemberAction ? 'Remove Member Access' : 'Cancel Invitation'}
// 								</AlertDialogTitle>
// 								<AlertDialogDescription>
// 									{isRemoveMemberAction
// 										? `This will remove ${member.user.email}'s access to this inventory. Their account will not be deleted, but they will no longer be able to view or edit this inventory.`
// 										: `This will cancel the pending invitation sent to ${member.user.email}. If they haven't created an account yet, the temporary entry will be removed.`}
// 								</AlertDialogDescription>
// 							</AlertDialogHeader>
// 						</AlertDialogContent>
// 					</AlertDialog>
// 				</DropdownMenuItem>
// 			</DropdownMenuContent>
// 		</DropdownMenu>
// 	);
// }