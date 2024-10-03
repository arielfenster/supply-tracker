'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
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
	CreateCategoryInput,
	createCategorySchema,
} from '$/schemas/categories/create-category.schema';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { addCategoryAction } from './actions';

export function AddCategoryFormContainer({ inventoryId }: { inventoryId: string }) {
	const [formKey, setFormKey] = useState(() => nanoid());

	return (
		<AddCategoryFormDialog
			key={formKey}
			inventoryId={inventoryId}
			onSuccess={() => setFormKey(nanoid())}
		/>
	);
}

function AddCategoryFormDialog({
	inventoryId,
	onSuccess,
}: {
	inventoryId: string;
	onSuccess: () => void;
}) {
	const { formRef, formMethods, toast, handleFormSubmit } = useFormSubmission<CreateCategoryInput>({
		schema: createCategorySchema,
		defaultValues: { inventoryId },
		action: addCategoryAction,
		toasts: {
			success() {
				onSuccess();
			},
			error(result) {
				toast.error({
					title: 'Failed to create category',
					description: result.error,
				});
			},
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' className='border-2 border-black mx-4'>
					<Plus />
					Add Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new category</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form
					className='flex flex-col gap-2'
					onSubmit={formMethods.handleSubmit(handleFormSubmit)}
					ref={formRef}
				>
					<input type='hidden' {...formMethods.register('inventoryId')} />
					<TextField
						label='Name'
						error={formMethods.formState.errors.name?.message}
						className='border-black'
						{...formMethods.register('name')}
					/>
					<SubmitButton size='sm'>Add</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
