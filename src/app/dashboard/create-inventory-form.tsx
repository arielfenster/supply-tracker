'use client';

import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';
import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { Button } from '$/components/ui/button';
import { inventories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
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
	const { formRef, formMethods, setPending, toast } =
		useFormSubmission<CreateInventoryInput>(createInventorySchema);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = formMethods;

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(createInventoryAction, setPending, {
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
		})(formData);
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
			<LabeledControl label='Name'>
				<ErrorControl error={errors.name?.message}>
					<Input
						id={inventories.name.name}
						placeholder='Enter inventory name'
						{...register('name')}
					/>
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
