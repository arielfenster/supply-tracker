import { Button } from '$/components/form/button';
import { FieldError } from '$/components/form/field-error';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { addItemAction } from './actions';

interface AddItemFormProps {
	subcategoryId: string;
}

export function AddItemFormContainer({ subcategoryId }: AddItemFormProps) {
	const [formKey, setFormKey] = useState(() => nanoid());

	function handleFormSuccess() {
		setFormKey(nanoid());
	}

	return (
		<AddItemFormDialog key={formKey} subcategoryId={subcategoryId} onSuccess={handleFormSuccess} />
	);
}

type AddItemFormDialogProps = {
	subcategoryId: string;
	onSuccess: () => void;
};

function AddItemFormDialog({ subcategoryId, onSuccess }: AddItemFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(addItemAction, { success: false, error: '' });

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			setOpen(newOpen);
			if (state.success) {
				onSuccess();
			}
		},
		[onSuccess, setOpen, state.success],
	);

	useEffect(() => {
		if (state.success) {
			handleOpenChange(false);
		}
	}, [state.success, handleOpenChange]);

	function handleSubmit(data: FormData) {
		data.set('subcategoryId', subcategoryId);
		formAction(data);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline' className='border-2 border-black hover:bg-neutral-100'>
					<Plus />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new item</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form className='flex flex-wrap items-center' action={handleSubmit}>
					<div className='flex gap-2'>
						<TextField label='Name' id='name' name='name' className='border-black' />
						<TextField label='Quantity' id='quantity' name='quantity' className='border-black' />
					</div>
					<div className='flex gap-2'>
						<TextField
							label='Warning threshold'
							id='warningThreshold'
							name='warningThreshold'
							className='border-black'
						/>
						<TextField
							label='Danger threshold'
							id='dangerThreshold'
							name='dangerThreshold'
							className='border-black'
						/>
					</div>
					{/* <div> */}
					<FieldError error={!state.success ? state.error : ''} />
					{/* </div> */}
					<SubmitButton size='sm' variant='success' className='mx-auto mt-1'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
