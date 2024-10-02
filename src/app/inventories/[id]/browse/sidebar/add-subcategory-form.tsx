'use client';

import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
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
import { subcategories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { useFormStore } from '$/stores/form-store';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { addSubcategoryAction } from './actions';
import {
	CreateSubcategoryInput,
	createSubcategorySchema,
} from '$/schemas/subcategories/create-subcategory.schema';
import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';

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
	const { formRef, formMethods, setPending, toast } =
		useFormSubmission<CreateSubcategoryInput>(createSubcategorySchema);

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		executeServerAction(addSubcategoryAction, setPending, {
			success() {
				onSuccess();
			},
			error(result) {
				toast.error({
					title: 'Failed to create subcategory',
					description: result.error,
				});
			},
		})(formData);
	}

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
				<form className='flex flex-col gap-2' onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
					<input type='hidden' name={subcategories.categoryId.name} defaultValue={categoryId} />
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
