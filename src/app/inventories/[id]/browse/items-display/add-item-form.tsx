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
import { Subcategory, items, measurementUnits } from '$/db/schemas';
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
	const { toast } = useToast();

	return (
		<Dialog>
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
						<input type='hidden' name={items.subcategoryId.name} defaultValue={subcategory.id} />
						<TextField
							label='Name'
							id={items.name.name}
							name={items.name.name}
							className='border-black'
						/>
					</div>
					<div className='flex w-full gap-8'>
						<LabeledField label='Unit of Measurement' name={items.measurement.name}>
							<Select name={items.measurement.name}>
								<SelectTrigger className='border-black' id={items.measurement.name}>
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
							id={items.quantity.name}
							name={items.quantity.name}
							className='border-black'
							placeholder='0'
						/>
					</div>
					<div className='flex w-full gap-8'>
						<TextField
							label='Warning threshold'
							id={items.warningThreshold.name}
							name={items.warningThreshold.name}
							className='border-black'
							placeholder='0'
						/>
						<TextField
							label='Danger threshold'
							id={items.dangerThreshold.name}
							name={items.dangerThreshold.name}
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
