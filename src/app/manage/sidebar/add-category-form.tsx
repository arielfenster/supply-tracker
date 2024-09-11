'use client';

import { Button } from '$/components/form/button';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import { UserInventory } from '../actions';
import { addCategoryAction } from './actions';

type Props = {
	inventory: UserInventory;
};

export function AddCategoryFormContainer({ inventory }: Props) {
	const [formKey, setFormKey] = useState(() => nanoid());

	const categoriesNames = useMemo(() => inventory.categories.map(({ name }) => name), [inventory]);

	return (
		<AddCategoryFormDialog
			key={formKey}
			categories={categoriesNames}
			onSuccess={() => setFormKey(nanoid())}
		/>
	);
}

type AddCategoryFormDialogProps = {
	onSuccess: () => void;
	categories: string[];
};

function AddCategoryFormDialog({ onSuccess, categories }: AddCategoryFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(addCategoryAction, { success: false, error: '' });
	const [localError, setLocalError] = useState('');

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
		const category = data.get('name')!.toString();
		if (categories.includes(category)) {
			setLocalError(`Category '${category}' already exists`);
			return;
		}

		formAction(data);
	}

	function getFieldError() {
		if (localError) {
			return localError;
		}

		if (!state.success) {
			return state.error;
		}

		return '';
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button size='sm' className='border-2 border-black hover:bg-neutral-100 mx-4'>
					<Plus />
					Add Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new category</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form className='flex gap-2 items-center' action={handleSubmit}>
					<TextField name='name' className='border-black' label='' error={getFieldError()} />
					<SubmitButton size='sm' variant='success' className='mb-2'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
