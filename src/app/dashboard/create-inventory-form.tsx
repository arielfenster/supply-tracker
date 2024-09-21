'use client';

import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useToast } from '$/components/hooks/use-toast';
import { executeServerAction } from '$/lib/forms';
import { PlusIcon } from 'lucide-react';
import { createInventoryAction } from './actions';

export function CreateInventoryForm() {
	const { toast } = useToast();

	return (
		<form
			action={executeServerAction(createInventoryAction, {
				success(result) {
					toast.success({ title: result.message });
				},
				error(result) {
					toast.error({ title: 'Failed to create inventory', description: result.error });
				},
			})}
		>
			<TextField label='Name' id='name' name='name' />
			<SubmitButton className='flex gap-1'>
				<PlusIcon />
				<span>Inventory</span>
			</SubmitButton>
		</form>
	);
}
