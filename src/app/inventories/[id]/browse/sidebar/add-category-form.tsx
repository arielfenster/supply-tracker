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
import { categories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
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
	const { formRef, formMethods, setPending, toast } =
		useFormSubmission<CreateCategoryInput>(createCategorySchema);

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(addCategoryAction, setPending, {
			success() {
				onSuccess();
			},
			error(result) {
				toast.error({
					title: 'Failed to create category',
					description: result.error,
				});
			},
		})(formData);
	}

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
				<form className='flex flex-col gap-2' onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
					<input type='hidden' name={categories.inventoryId.name} defaultValue={inventoryId} />
					<LabeledControl label='Name'>
						<ErrorControl error={formMethods.formState.errors.name?.message}>
							<Input className='border-black' {...formMethods.register('name')} />
						</ErrorControl>
					</LabeledControl>
					<SubmitButton size='sm'>Add</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
