'use client';

import { FieldError } from '$/components/form/field-error';
import { Input } from '$/components/form/input';
import { Label } from '$/components/form/label';
import { LabeledField } from '$/components/form/labeled-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
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
	orientation = 'vertical',
	onCancel,
	onSuccess,
}: {
	orientation?: 'vertical' | 'horizontal';
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
			<div className='grid grid-cols-4 items-center gap-x-4'>
				{orientation === 'horizontal' ? (
					<>
						<Label htmlFor={inventories.name.name} className='text-right'>
							Name
						</Label>
						<div className='flex flex-col col-span-3'>
							<Input
								id={inventories.name.name}
								placeholder='Enter inventory name'
								{...register('name')}
							/>
						</div>
						<div className='text-right col-span-4'>
							<FieldError error={errors.name?.message} />
						</div>
					</>
				) : (
					<div className='col-span-3'>
						<LabeledField label='Name' error={errors.name?.message}>
							<Input
								id={inventories.name.name}
								placeholder='Enter inventory name'
								{...register('name')}
							/>
						</LabeledField>
					</div>
				)}
			</div>
			<div className='flex gap-2 mt-4 justify-end'>
				<SubmitButton className='flex gap-2'>Create</SubmitButton>
				<Button type='button' variant='secondary' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
