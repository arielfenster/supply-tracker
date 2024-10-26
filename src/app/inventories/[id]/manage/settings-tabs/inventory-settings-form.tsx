'use client';

import { useFormSubmission } from '$/hooks/useFormSubmission';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { inventories } from '$/db/schemas';
import {
	UpdateInventoryInput,
	updateInventorySchema,
} from '$/schemas/inventories/update-inventory.schema';
import { updateInventoryAction } from '../actions';
import { useManagePageContext } from '../context';

export function InventorySettingsForm() {
	const { inventory } = useManagePageContext();
	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
		},
		handleFormSubmit,
		toast,
	} = useFormSubmission<UpdateInventoryInput>({
		schema: updateInventorySchema,
		defaultValues: { id: inventory.id, name: inventory.name },
		action: updateInventoryAction,
		toasts: {
			success() {
				toast.success({
					title: 'Inventory updated',
				});
			},
			error(result) {
				toast.error({
					title: 'Failed to update inventory',
					description: result.error,
				});
			},
		},
	});

	return (
		<form className='flex flex-col w-1/2' ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
			<input type='hidden' {...register('id')} />
			<TextField
				label='Inventory Name'
				id={inventories.name.name}
				error={errors.name?.message}
				{...register('name')}
			/>
			<div>
				<SubmitButton>Update</SubmitButton>
			</div>
		</form>
	);
}
