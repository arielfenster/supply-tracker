'use client';

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
import { UserRole } from '$/db/schemas';
import { useFormSubmission } from '$/hooks/useFormSubmission';
import {
	RemoveUserFromInventoryInput,
	removeUserFromInventorySchema,
} from '$/schemas/inventories/remove-user.schema';
import {
	UpdateUserRoleInput,
	updateUserRoleSchema,
} from '$/schemas/inventories/update-user-role.schema';
import { EllipsisVertical, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { removeUserFromInventoryAction, updateUserRoleAction } from '../actions';
import { type TableEntryData } from './utils';

type ActionsDropdownMenuProps = {
	member: TableEntryData['user'];
	role: UserRole;
	inventoryId: string;
};

export function ActionsDropdownMenu({ member, role, inventoryId }: ActionsDropdownMenuProps) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
						<ChangeRoleForm
							member={member}
							role={role}
							inventoryId={inventoryId}
							onChange={setIsDropdownOpen}
						/>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem className='flex justify-between'>
					<RemoveUserFromInventoryForm member={member} inventoryId={inventoryId} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ChangeRoleForm({
	member,
	role,
	inventoryId,
	onChange,
}: ActionsDropdownMenuProps & { onChange: (value: boolean) => void }) {
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
							onChange(false);
							formRef.current!.requestSubmit();
						}}
					>
						<RadioGroupItem value={UserRole.EDITOR}>{UserRole.EDITOR}</RadioGroupItem>
						<RadioGroupItem value={UserRole.VIEWER}>{UserRole.VIEWER}</RadioGroupItem>
					</RadioGroup>
				)}
			/>
		</form>
	);
}

function RemoveUserFromInventoryForm({
	member,
	inventoryId,
}: Pick<ActionsDropdownMenuProps, 'member' | 'inventoryId'>) {
	const {
		formRef,
		formMethods: { register, handleSubmit },
		toast,
		handleFormSubmit,
	} = useFormSubmission<RemoveUserFromInventoryInput>({
		schema: removeUserFromInventorySchema,
		action: removeUserFromInventoryAction,
		defaultValues: {
			inventoryId,
			userId: member.id,
		},
		toasts: {
			success() {
				toast.success({ title: 'User removed' });
			},
			error(result) {
				toast.error({ title: 'Failed to remove user', description: result.error });
			},
		},
	});

	return (
		<form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className='w-full'>
			<input type='hidden' {...register('inventoryId')} />
			<input type='hidden' {...register('userId')} />
			<div
				className='flex justify-between w-full text-destructive'
				onClick={() => {
					formRef.current!.requestSubmit();
				}}
			>
				<span>Delete</span>
				<TrashIcon />
			</div>
		</form>
	);
}
