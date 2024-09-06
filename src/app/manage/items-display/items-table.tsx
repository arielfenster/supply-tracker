'use client';

import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { Item } from '$/db/schemas';
import { cn } from '$/lib/utils';
import { Save, Trash } from 'lucide-react';
import { useFormState } from 'react-dom';
import { deleteItemAction, updateItemAction } from './actions';

interface ItemsTableProps {
	items: Item[];
}

export function ItemsTable({ items }: ItemsTableProps) {
	// TODO: when state is success or server error, show a toast message
	const [updateState, updateFormAction] = useFormState(updateItemAction, {
		success: false,
		error: '',
	});
	const [deleteState, deleteFormAction] = useFormState(deleteItemAction, {
		success: false,
		error: '',
	});

	function getQuantityClassName(item: Item) {
		const { quantity, dangerThreshold, warningThreshold } = item;

		if (quantity === 0) return 'bg-black text-white';
		if (quantity <= dangerThreshold) return 'bg-red-500 text-white';
		if (quantity <= warningThreshold) return 'bg-orange-400 text-white';

		return '';
	}

	function getInputBorderColor(bgColor: ReturnType<typeof getQuantityClassName>) {
		if (bgColor === '') return 'border-black';

		return 'border-white';
	}

	return (
		<div className='flex flex-col min-w-full'>
			<div className='grid grid-cols-5 gap-2 bg-gray-200'>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Name
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Quantity
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Warning
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Danger
				</span>
				<span className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
					Actions
				</span>
			</div>
			<div>
				{items.length ? (
					items.map((item, index) => {
						const quantityClassName = getQuantityClassName(item);
						const inputBorderColor = getInputBorderColor(quantityClassName);

						return (
							<form key={items[index].id} action={updateFormAction}>
								<div className='grid grid-cols-5 border-t-4 border-r-4 border-l-4 last:border-b-4 border-gray-200'>
									<Input className='hidden' name='id' defaultValue={items[index].id} />
									<div className='px-4 py-4 text-md text-gray-700'>
										<Input
											name='name'
											defaultValue={items[index].name}
											className='border border-black'
										/>
										{/* <FieldError error={errors?.items?.[index]?.name?.message} /> */}
									</div>
									<div className={cn('px-4 py-4 text-md text-gray-700')}>
										<Input
											name='quantity'
											defaultValue={items[index].quantity}
											className={cn(
												'bg-transparent border font-bold',
												inputBorderColor,
												quantityClassName,
											)}
										/>
										{/* <FieldError error={errors?.items?.[index]?.quantity?.message} /> */}
									</div>
									<div className='pl-4 py-4 text-md text-gray-700'>
										<Input
											name='warningThreshold'
											defaultValue={items[index].warningThreshold}
											className='border border-black'
										/>
										{/* <FieldError error={errors?.items?.[index]?.warningThreshold?.message} /> */}
									</div>
									<div className='pl-4 py-4 text-md text-gray-700'>
										<Input
											name='dangerThreshold'
											defaultValue={items[index].dangerThreshold}
											className='border border-black'
										/>
										{/* <FieldError error={errors?.items?.[index]?.dangerThreshold?.message} /> */}
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
												formAction={deleteFormAction}
											>
												<Trash className='h-5 w-5' />
												<span className='font-semibold'>Delete</span>
											</SubmitButton>
										</div>
									</div>
								</div>
							</form>
						);
					})
				) : (
					<h3 className='mt-2'>
						You have no items in this subcategory. Click the button to add an item
					</h3>
				)}
			</div>
		</div>
	);
}
