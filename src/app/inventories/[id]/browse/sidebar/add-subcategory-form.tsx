'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';
import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
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
	CreateSubcategoryInput,
	createSubcategorySchema,
} from '$/schemas/subcategories/create-subcategory.schema';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { addSubcategoryAction } from './actions';

export function AddSubcategoryFormContainer({ categoryId }: { categoryId: string }) {
	const [formKey, setFormKey] = useState(() => nanoid());

	return (
		<AddSubcategoryFormDialog
			key={formKey}
			onSuccess={() => setFormKey(nanoid())}
			categoryId={categoryId}
		/>
	);
}

function AddSubcategoryFormDialog({
	onSuccess,
	categoryId,
}: {
	categoryId: string;
	onSuccess: () => void;
}) {
	const { formRef, formMethods, toast, handleFormSubmit } =
		useFormSubmission<CreateSubcategoryInput>({
			schema: createSubcategorySchema,
			defaultValues: { categoryId },
			action: addSubcategoryAction,
			toasts: {
				success() {
					onSuccess();
				},
				error(result) {
					toast.error({
						title: 'Failed to create subcategory',
						description: result.error,
					});
				},
			},
		});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline'>
					<Plus />
					Add Subcategory
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new subcategory</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form
					className='flex flex-col gap-2'
					onSubmit={formMethods.handleSubmit(handleFormSubmit)}
					ref={formRef}
				>
					<input type='hidden' {...formMethods.register('categoryId')} />
					<LabeledControl label='Name'>
						<ErrorControl error={formMethods.formState.errors.name?.message}>
							<Input className='border-black' {...formMethods.register('name')} />
						</ErrorControl>
					</LabeledControl>
					<SubmitButton size='sm' className=''>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
