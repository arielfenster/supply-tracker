'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { Badge } from '$/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '$/components/ui/radio-group';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '$/components/ui/table';
import { InviteStatus, User, UserRole } from '$/db/schemas';
import { cn } from '$/lib/utils';
import {
	UpdateUserRoleInput,
	updateUserRoleSchema,
} from '$/schemas/inventories/update-user-role.schema';
import { EllipsisVertical, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { updateUserRoleAction } from '../actions';
import { useManagePageContext } from '../context';

export function InventoryMembersTable() {
	const { members, currentMember, pendingInvites, inventory } = useManagePageContext();

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
								{InviteStatus.ACTIVE}
							</Badge>
						</TableCell>
						{isCurrentMemberInventoryOwner && member.user.id !== currentMember.user.id && (
							<TableCell>
								<ActionsDropdownMenu
									member={member.user}
									status={InviteStatus.ACTIVE}
									role={member.role!}
									inventoryId={inventory.id}
								/>
							</TableCell>
						)}
					</TableRow>
				))}
				{pendingInvites.map((item) => (
					<TableRow key={item.invite.id}>
						<TableCell>
							{item.recipient.firstName} {item.recipient.lastName}
						</TableCell>
						<TableCell>{item.recipient.email}</TableCell>
						<TableCell>{item.role}</TableCell>
						<TableCell>
							<Badge variant='secondary'>{item.invite.status}</Badge>
						</TableCell>
						{isCurrentMemberInventoryOwner && (
							<TableCell>
								<ActionsDropdownMenu
									member={item.recipient}
									status={InviteStatus.PENDING}
									role={item.role}
									inventoryId={inventory.id}
								/>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function ActionsDropdownMenu({
	member,
	role,
	status,
	inventoryId,
}: {
	member: User;
	status: InviteStatus;
	role: UserRole;
	inventoryId: string;
}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const {
		formRef,
		formMethods: { register, handleSubmit, control },
		toast,
		handleFormSubmit,
	} = useFormSubmission<UpdateUserRoleInput>({
		schema: updateUserRoleSchema,
		action: updateUserRoleAction,
		defaultValues: {
			userId: member.id,
			inventoryId,
			role,
		},
		toasts: {
			success() {
				toast.success({ title: 'Role updated' });
			},
			error(result) {
				toast.error({ title: 'Failed to update role', description: result.error });
			},
		},
	});

	return (
		<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<EllipsisVertical />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-36'>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className='flex justify-between'>
						Change role
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
							<input type='hidden' {...register('inventoryId')} />
							<input type='hidden' {...register('userId')} />
							<Controller
								control={control}
								name='role'
								render={({ field }) => (
									<RadioGroup
										name='role'
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											setIsDropdownOpen(false);
											formRef.current!.requestSubmit();
										}}
									>
										<RadioGroupItem value={UserRole.EDITOR}>{UserRole.EDITOR}</RadioGroupItem>
										<RadioGroupItem value={UserRole.VIEWER}>{UserRole.VIEWER}</RadioGroupItem>
									</RadioGroup>
								)}
							/>
						</form>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem className='flex justify-between'>
					<div className='flex justify-between w-full text-destructive'>
						<span>Delete</span>
						<TrashIcon />
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
