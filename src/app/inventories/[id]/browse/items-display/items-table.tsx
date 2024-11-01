'use client';

import { SubmitButton } from '$/components/form/submit-button';
import { Item, measurementUnits, items as schemaItems } from '$/db/schemas';
import { cn } from '$/lib/utils';
import { EllipsisVertical, MoveIcon, PenIcon, TrashIcon } from 'lucide-react';
import { deleteItemAction, updateItemAction } from './actions';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import { useFormSubmission } from '$/hooks/useFormSubmission';
import { DeleteItemInput, deleteItemSchema } from '$/schemas/items/delete-item.schema';
import { QuantityUnitField } from '$/components/form/quantity-unit-field';

interface ItemsTableProps {
	// TODO: rename to data?
	items: Item[];
}

export function ItemsTable({ items }: ItemsTableProps) {
	// const setPending = useFormStore((store) => store.setPending);
	// const { toast } = useToast();

	function getQuantityClassName(item: Item) {
		const { quantity, dangerThreshold, warningThreshold } = item;

		const intQuantity = Number(quantity);

		if (intQuantity === 0) return 'bg-black text-white';
		if (intQuantity <= dangerThreshold) return 'bg-red-500 text-white';
		if (intQuantity <= warningThreshold) return 'bg-orange-400 text-white';

		return '';
	}

	return (
		<table className='min-w-full shadow-md rounded-lg'>
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
					<th className='pr-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 tracking-wider'>
						ACTIONS
					</th>
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
								<QuantityUnitField
									quantity={item.quantity}
									measurement={item.measurement}
									quantityClassName={getQuantityClassName(item)}
								/>
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
							<td className='pl-4'>
								<ActionsDropdownMenu item={item} />
							</td>
						</tr>
					))
				) : (
					<h3 className='p-4'>
						You have no items in this subcategory. Click the button to add an item
					</h3>
				)}
			</tbody>
		</table>
	);
}

type ActionsDropdownMenuProps = { item: Item };
function ActionsDropdownMenu({ item }: ActionsDropdownMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<EllipsisVertical />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className='flex justify-between'>
					<EditItemForm item={item} />
				</DropdownMenuItem>
				<DropdownMenuItem className='flex justify-between'>
					<MoveItemForm />
				</DropdownMenuItem>
				<DropdownMenuItem className=''>
					<DeleteItemForm id={item.id} />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function EditItemForm({ item }: { item: Item }) {
	return (
		<>
			<span>Edit</span>
			<PenIcon />
		</>
	);
}

function MoveItemForm() {
	return (
		<>
			<span>Move</span>
			<MoveIcon />
		</>
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
				className='flex justify-between text-destructive focus:text-destructive'
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
