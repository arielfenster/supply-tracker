import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useToast } from '$/components/hooks/use-toast';
import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import { executeServerAction } from '$/lib/forms';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
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
	const { toast } = useToast();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline'>
					<Plus />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new item</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form
					className='flex flex-wrap items-center'
					action={executeServerAction(addItemAction, {
						success() {
							toast.success({ title: 'Item added' });
							onSuccess();
							setOpen(false);
						},
						error(result) {
							toast.error({
								title: 'Failed to add item',
								description: result.error,
							});
						},
					})}
				>
					<div className='flex gap-2'>
						<input hidden className='hidden' name='subcategoryId' defaultValue={subcategoryId} />
						<TextField label='Name' id='name' name='name' className='border-black' />
						<TextField
							label='Quantity'
							id='quantity'
							name='quantity'
							className='border-black'
							placeholder='0'
						/>
					</div>
					<div className='flex gap-2'>
						<TextField
							label='Warning threshold'
							id='warningThreshold'
							name='warningThreshold'
							className='border-black'
							placeholder='0'
						/>
						<TextField
							label='Danger threshold'
							id='dangerThreshold'
							name='dangerThreshold'
							className='border-black'
							placeholder='0'
						/>
					</div>
					<SubmitButton className='mx-auto mt-1'>Add</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
