'use client';

import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { useToast } from '$/components/hooks/use-toast';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { Item, measurementUnits, items as schemaItems } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { cn } from '$/lib/utils';
import { Save, Trash } from 'lucide-react';
import { deleteItemAction, updateItemAction } from './actions';

interface ItemsTableProps {
	items: Item[];
}

export function ItemsTable({ items }: ItemsTableProps) {
	const { toast } = useToast();

	function getQuantityClassName(item: Item) {
		const { quantity, dangerThreshold, warningThreshold } = item;

		const intQuantity = Number(quantity);

		if (intQuantity === 0) return 'bg-black text-white';
		if (intQuantity <= dangerThreshold) return 'bg-red-500 text-white';
		if (intQuantity <= warningThreshold) return 'bg-orange-400 text-white';

		return '';
	}

	return (
		<div className='flex flex-col min-w-full'>
			<div className='grid grid-cols-5 gap-2 bg-gray-200'>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Name
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Quantity
					<span className='text-[10px] ml-1'>| Measurement</span>
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Warning Threshold
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Danger Threshold
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Actions
				</span>
			</div>
			<div>
				{items.length ? (
					items.map((item, index) => (
						<form
							key={items[index].id}
							action={executeServerAction(updateItemAction, {
								success() {
									toast.success({
										title: 'Item updated',
									});
								},
								error(result) {
									toast.error({
										title: 'An error has occurred updating the item',
										description: result.error,
									});
								},
							})}
						>
							<div className='grid grid-cols-5 border-t-4 border-r-4 border-l-4 last:border-b-4 border-gray-200'>
								<input type='hidden' name={schemaItems.id.name} defaultValue={item.id} />
								<div className='px-4 py-4 text-md text-gray-700'>
									<Input
										name={schemaItems.name.name}
										defaultValue={item.name}
										className='border border-black'
									/>
								</div>
								<div className='px-4 py-4 text-md text-gray-700'>
									<QuantityUnitField
										quantity={item.quantity}
										measurement={item.measurement}
										quantityClassName={getQuantityClassName(item)}
									/>
								</div>
								<div className='pl-4 py-4 text-md text-gray-700'>
									<Input
										name={schemaItems.warningThreshold.name}
										defaultValue={item.warningThreshold}
										className='border border-black'
									/>
								</div>
								<div className='pl-4 py-4 text-md text-gray-700'>
									<Input
										name={schemaItems.dangerThreshold.name}
										defaultValue={item.dangerThreshold}
										className='border border-black'
									/>
								</div>
								<div className='pl-4 py-4 text-md text-gray-700 flex mt-[2px]'>
									<div className='flex gap-4'>
										<SubmitButton variant='success' size='sm' className='gap-1'>
											<Save className='h-5 w-5' />
											<span className='font-semibold'>Save</span>
										</SubmitButton>
										<SubmitButton
											variant='destructive'
											size='sm'
											className='gap-1'
											formAction={executeServerAction(deleteItemAction, {
												success() {
													toast.success({
														title: 'Item deleted',
													});
												},
												error(result) {
													toast.error({
														title: 'An error has occurred deleting the item',
														description: result.error,
													});
												},
											})}
										>
											<Trash className='h-5 w-5' />
											<span className='font-semibold'>Delete</span>
										</SubmitButton>
									</div>
								</div>
							</div>
						</form>
					))
				) : (
					<h3 className='mt-2'>
						You have no items in this subcategory. Click the button to add an item
					</h3>
				)}
			</div>
		</div>
	);
}

function QuantityUnitField({
	quantity,
	measurement,
	quantityClassName,
}: {
	quantity: string;
	measurement: string;
	quantityClassName: string;
}) {
	return (
		<div className='flex'>
			<Input
				name={schemaItems.quantity.name}
				defaultValue={quantity}
				className={cn('border-black font-bold border-r-1 rounded-r-none', quantityClassName)}
			/>
			<Select name={schemaItems.measurement.name} defaultValue={measurement}>
				<SelectTrigger
					className='border-l-0 rounded-l-none border-black'
					id={schemaItems.measurement.name}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{measurementUnits.map((measurement) => (
							<SelectItem key={measurement} value={measurement}>
								{measurement[0].toUpperCase() + measurement.slice(1)}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
