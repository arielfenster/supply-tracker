'use client';

import { Input } from '$/components/form/input';
import { Label } from '$/components/form/label';
import { SubmitButton } from '$/components/form/submit-button';
import { useToast } from '$/components/hooks/use-toast';
import { Button } from '$/components/ui/button';
import { inventories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { useFormStore } from '$/stores/form-store';
import { createInventoryAction } from './actions';

export function CreateInventoryForm({
	onCancel,
	onSuccess,
}: {
	onCancel?: () => void;
	onSuccess?: () => void;
}) {
	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	return (
		<form
			action={executeServerAction(createInventoryAction, setPending, {
				success(result) {
					toast.success({ title: result.message });
					onSuccess?.();
				},
				error(result) {
					toast.error({ title: 'Failed to create inventory', description: result.error });
				},
			})}
		>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor={inventories.name.name} className='text-right'>
					Name
				</Label>
				<Input
					id={inventories.name.name}
					name={inventories.name.name}
					className='col-span-3'
					placeholder='Enter inventory name'
				/>
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
