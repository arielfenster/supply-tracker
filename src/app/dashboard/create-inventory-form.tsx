'use client';

import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { Button } from '$/components/ui/button';
import {
	CreateInventoryInput,
	createInventorySchema,
} from '$/schemas/inventories/create-inventory.schema';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { createInventoryAction } from './actions';

export function CreateInventoryForm({
	onCancel,
	onSuccess,
}: {
	onCancel?: () => void;
	onSuccess?: () => void;
}) {
	const {
		formRef,
		formMethods: {
			handleSubmit,
			register,
			formState: { errors },
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<CreateInventoryInput>({
		schema: createInventorySchema,
		action: createInventoryAction,
		toasts: {
			success(result) {
				toast.success({ title: result.message });
				onSuccess?.();
			},
			error(result) {
				toast.error({
					title: 'Failed to create inventory',
					description: result.error,
				});
			},
		},
	});

	return (
		<form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
			<TextField
				label='Name'
				error={errors.name?.message}
				placeholder='Enter inventory name'
				{...register('name')}
			/>
			<div className='flex gap-2 mt-4 justify-end'>
				<SubmitButton className='flex gap-2'>Create</SubmitButton>
				<Button type='button' variant='secondary' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
