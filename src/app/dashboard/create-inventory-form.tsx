'use client';

import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';
import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { Button } from '$/components/ui/button';
import { inventories } from '$/db/schemas';
import {
	CreateInventoryInput,
	createInventorySchema,
} from '$/schemas/inventories/create-inventory.schema';
import { useFormSubmission } from '../_hooks/useFormSubmission';
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
			<LabeledControl label='Name' name={inventories.name.name}>
				<ErrorControl error={errors.name?.message}>
					<Input placeholder='Enter inventory name' {...register('name')} />
				</ErrorControl>
			</LabeledControl>
			<div className='flex gap-2 mt-4 justify-end'>
				<SubmitButton className='flex gap-2'>Create</SubmitButton>
				<Button type='button' variant='secondary' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
