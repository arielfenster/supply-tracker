'use client';

import { useAuthContext } from '$/app/(auth)/context';
import { QuantityMeasurementField } from '$/components/form/quantity-measurement-field';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '$/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { Item } from '$/db/schemas';
import { useFormSubmission } from '$/hooks/useFormSubmission';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { isManageInventoryRole } from '$/lib/inventories';
import { cn } from '$/lib/utils';
import { DeleteItemInput, deleteItemSchema } from '$/schemas/items/delete-item.schema';
import { EllipsisVertical, MoveIcon, PenIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { deleteItemAction } from './actions';
import { ItemForm } from './item-form';
import { MoveItemForm } from './move-item-form';

interface ItemsTableProps {
	items: Item[];
	inventory: UserInventory;
}

export function ItemsTable({ items, inventory }: ItemsTableProps) {
	const { isMobile } = useMediaQuery();
	const { user } = useAuthContext();

	return isMobile ? (
		<div className='space-y-4'>
			{items.map((item) => (
				<div key={item.id} className='border-foreground border p-4 rounded-lg space-y-3'>
					<div className='flex justify-between'>
						<span className='text-lg font-bold'>{item.name}</span>
						{
							isManageInventoryRole(user.role) && <ActionsDropdownMenu item={item} inventory={inventory} />
						}
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col'>
							<span className='text-gray-500'>Quantity</span>
							<span>{item.quantity} {item.measurement}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-gray-500'>Warning threshold</span>
							<span>{item.warningThreshold}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-gray-500'>Danger threshold</span>
							<span>{item.dangerThreshold}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-gray-500'>Status</span>
							<span className={
								cn('font-bold text-lg',
									Number(item.quantity) === 0 ? 'text-black' :
									Number(item.quantity) <= Number(item.dangerThreshold) ? 'text-destructive' :
									Number(item.quantity) <= Number(item.warningThreshold) ? 'text-yellow-500' :
									'text-green-500'
								)}>
								{
									Number(item.quantity) === 0 ? 'OUT OF STOCK' :
									Number(item.quantity) <= Number(item.dangerThreshold) ? 'Low Stock' :
									Number(item.quantity) <= Number(item.warningThreshold) ? 'Warning Stock' :
									'In Stock'
								}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	) : (
		<table className='min-w-full shadow-md rounded-lg border-b-2'>
			<thead>
				<tr>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
						NAME
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
						QUANTITY
						<span className='text-[10px] ml-1'>| Measurement</span>
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
						WARNING THRESHOLD
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
						DANGER THRESHOLD
					</th>
					{
						isManageInventoryRole(user.role) && (
							<th className='pr-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
								ACTIONS
							</th>
						)
					}
				</tr>
			</thead>
			<tbody>
				{items.length ? (
					items.map((item) => (
						<tr key={item.id}>
							<td className='px-4 py-4 text-md text-gray-700'>
								<span className='flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border border-black'>
									{item.name}
								</span>
							</td>
							<td className='px-4 py-4 text-md text-gray-700'>
								<QuantityMeasurementField item={item} />
							</td>
							<td className='pl-4 py-4 text-md text-gray-700'>
								<span className='flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border border-black'>
									{item.warningThreshold}
								</span>
							</td>
							<td className='pl-4 py-4 text-md text-gray-700'>
								<span className='flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm border border-black'>
									{item.dangerThreshold}
								</span>
							</td>
							{
								isManageInventoryRole(user.role) && (
									<td className='pl-4'>
										<ActionsDropdownMenu item={item} inventory={inventory} />
									</td>
								)
							}
						</tr>
					))
				) : (
					<tr>
						<td>
							<h3 className='p-4'>
								You have no items in this subcategory. Click the button to add an item
							</h3>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

function ActionsDropdownMenu({ item, inventory }: { item: Item; inventory: UserInventory }) {
	const [openDialogType, setOpenDialogType] = useState<'update' | 'move' | null>(null);

	function closeDialog() {
		setOpenDialogType(null);
		setTimeout(() => {
			// resetting the pointer events for the dropdown trigger, otherwise it won't be clickable again
			document.body.style.pointerEvents = '';
		}, 100);
	}

	return (
		<Dialog open={openDialogType !== null} onOpenChange={closeDialog}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<EllipsisVertical className='cursor-pointer' />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={() => setOpenDialogType('update')}>
						<div className='flex justify-between w-full cursor-pointer'>
							<span>Edit</span>
							<PenIcon />
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => setOpenDialogType('move')}>
						<div className='flex justify-between w-full cursor-pointer'>
							<span>Move</span>
							<MoveIcon />
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<DeleteItemForm id={item.id} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{openDialogType === 'update' && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Item</DialogTitle>
					</DialogHeader>
					<DialogDescription className='text-foreground'>Update {item.name}</DialogDescription>
					<ItemForm item={item} subcategoryId={item.subcategoryId} onSuccess={closeDialog} />
				</DialogContent>
			)}
			{openDialogType === 'move' && (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Move Item</DialogTitle>
					</DialogHeader>
					<DialogDescription className='text-foreground'>
						Move &quot;{item.name}&quot; to a different category or subcategory
					</DialogDescription>
					<MoveItemForm itemId={item.id} inventory={inventory} onSuccess={closeDialog} />
				</DialogContent>
			)}
		</Dialog>
	);
}

function DeleteItemForm({ id }: { id: string }) {
	const {
		formRef,
		formMethods: { register, handleSubmit },
		toast,
		handleFormSubmit,
	} = useFormSubmission<DeleteItemInput>({
		schema: deleteItemSchema,
		action: deleteItemAction,
		defaultValues: { id },
		toasts: {
			success() {
				toast.success({
					title: 'Item deleted',
				});
			},
			error(result) {
				toast.error({
					title: 'Failed to delete the item',
					description: result.error,
				});
			},
		},
	});
	return (
		<form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className='w-full'>
			<input type='hidden' {...register('id')} />
			<div
				className='flex justify-between text-destructive focus:text-destructive cursor-pointer'
				onClick={() => {
					formRef.current!.requestSubmit();
				}}
			>
				Delete
				<TrashIcon />
			</div>
		</form>
	);
}
