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
import { Subcategory } from '$/db/schemas';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormState } from 'react-dom';
import { addSubcategoryAction } from './actions';

type Props = {
	subcategories: Subcategory[];
	categoryId: string;
};

export function AddSubcategoryFormContainer({ subcategories, categoryId }: Props) {
	const [formKey, setFormKey] = useState(() => nanoid());

	const subcategoriesNames = useMemo(() => subcategories.map(({ name }) => name), [subcategories]);

	return (
		<AddSubcategoryFormDialog
			key={formKey}
			onSuccess={() => setFormKey(nanoid())}
			categoryId={categoryId}
			subcategories={subcategoriesNames}
		/>
	);
}

type AddSubcategoryFormDialogProps = {
	onSuccess: () => void;
	subcategories: string[];
	categoryId: string;
};

function AddSubcategoryFormDialog({
	onSuccess,
	subcategories,
	categoryId,
}: AddSubcategoryFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useFormState(addSubcategoryAction, { success: false, error: '' });
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
		const subcategory = data.get('subcategory')!.toString();
		if (subcategories.includes(subcategory)) {
			setLocalError(`Subcategory '${subcategory}' already exists`);
			return;
		}

		data.set('categoryId', categoryId);
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
				<Button size='sm' variant='outline' className='border-2 border-black hover:bg-neutral-100'>
					<Plus />
					Add Subcategory
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new subcategory</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form className='flex gap-2 items-center' action={handleSubmit}>
					<TextField
						name='subcategory'
						placeholder='Subcategory'
						className='border-black'
						label=''
						error={getFieldError()}
					/>
					<SubmitButton size='sm' variant='success' className='mb-2'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
