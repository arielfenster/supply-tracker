'use client';

import { Button } from '$/components/form/button';
import { FieldError } from '$/components/form/field-error';
import { Input } from '$/components/form/input';
import { Item } from '$/db/schemas';
import { cn } from '$/lib/utils';
import { updateItemSchema } from '$/schemas/items/update-item.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash } from 'lucide-react';
import { useFormState } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { meow } from './actions';

interface ItemsTableProps {
	items: Item[];
}

export function ItemsTable({ items }: ItemsTableProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		getValues,
	} = useForm<{ items: Item[] }>({
		resolver: zodResolver(updateItemSchema),
		defaultValues: {
			items,
		},
	});
	const { fields } = useFieldArray({ control, name: 'items' });

	// when state is success or server error, show a toast message
	const [updateState, updateFormAction] = useFormState(meow, { success: false, error: '' });
	const [deleteState, deleteFormAction] = useFormState(meow, { success: false, error: '' });

	// function handleUpdateSubmit(index: number) {
	// 	const values = getValues(`items.${index}`);
	// 	const formData = Object.fromEntries(values);
	// }

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
		<table className='min-w-full bg-white shadow-md rounded-lg'>
			<thead>
				<tr>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Name
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Quantity
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Warning
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Danger
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{fields.map((item, index) => {
					const quantityClassName = getQuantityClassName(item);
					const inputBorderColor = getInputBorderColor(quantityClassName);

					return (
						<tr key={item.id} className='border-t-4 border-gray-200 *:w-1/5'>
							<td className='px-4 py-4 text-md text-gray-700'>
								<Input {...register(`items.${index}.name`)} className='border border-black' />
								<FieldError error={errors?.items?.[index]?.name?.message} />
							</td>
							<td className={cn('px-4 py-4 text-md text-gray-700', quantityClassName)}>
								<Input
									{...register(`items.${index}.quantity`, { valueAsNumber: true })}
									className={cn('bg-transparent border', inputBorderColor)}
								/>
								<FieldError error={errors?.items?.[index]?.quantity?.message} />
							</td>
							<td className='pl-4 py-4 text-md text-gray-700'>
								<Input
									{...register(`items.${index}.warningThreshold`, { valueAsNumber: true })}
									className='border border-black'
								/>
								<FieldError error={errors?.items?.[index]?.warningThreshold?.message} />
							</td>
							<td className='pl-4 py-4 text-md text-gray-700'>
								<Input
									{...register(`items.${index}.dangerThreshold`, { valueAsNumber: true })}
									className='border border-black'
								/>
								<FieldError error={errors?.items?.[index]?.dangerThreshold?.message} />
							</td>
							<td className='pl-4 py-4 text-md text-gray-700 flex mt-[2px]'>
								<div className='flex gap-4'>
									<form>
										<Button variant='success' size='sm' className='gap-1'>
											<Save className='h-5 w-5' />
											<span className='font-semibold'>Save</span>
										</Button>
									</form>
									<form action={deleteFormAction}>
										<Button variant='destructive' size='sm' className='gap-1'>
											<Trash className='h-5 w-5' />
											<span className='font-semibold'>Delete</span>
										</Button>
									</form>
								</div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
