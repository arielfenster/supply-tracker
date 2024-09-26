import { LabeledField } from '$/components/form/labeled-field';
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { Subcategory, measurementUnits } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { addItemAction } from './actions';

interface AddItemFormProps {
	subcategory: Subcategory;
}

export function AddItemFormContainer({ subcategory }: AddItemFormProps) {
	const [formKey, setFormKey] = useState(() => nanoid());

	function handleFormSuccess() {
		setFormKey(nanoid());
	}

	return (
		<AddItemFormDialog key={formKey} subcategory={subcategory} onSuccess={handleFormSuccess} />
	);
}

type AddItemFormDialogProps = {
	subcategory: Subcategory;
	onSuccess: () => void;
};

function AddItemFormDialog({ subcategory, onSuccess }: AddItemFormDialogProps) {
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
				<DialogDescription className='text-foreground'>
					Add a new item to the {subcategory.name} subcategory
				</DialogDescription>
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
					<div className='flex w-full'>
						<input hidden className='hidden' name='subcategoryId' defaultValue={subcategory.id} />
						<TextField label='Name' id='name' name='name' className='border-black' />
					</div>
					<div className='flex w-full gap-8'>
						<LabeledField label='Unit of Measurement' name='measurement'>
							<Select name='measurement'>
								<SelectTrigger className='border-black' id='measurement'>
									<SelectValue placeholder='Select measurement' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{measurementUnits.map((measurement) => (
											<SelectItem key={measurement} value={measurement}>
												{measurement[0].toUpperCase() + measurement.slice(1)}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</LabeledField>
						<TextField
							label='Quantity'
							id='quantity'
							name='quantity'
							className='border-black'
							placeholder='0'
						/>
					</div>
					<div className='flex w-full gap-8'>
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
					<div className='w-full mt-4'>
						<SubmitButton className='w-full'>Add Item</SubmitButton>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
