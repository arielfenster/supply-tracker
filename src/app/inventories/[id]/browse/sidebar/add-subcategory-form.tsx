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
	const { toast } = useToast();

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
					className='flex gap-2 items-center'
					action={executeServerAction(addSubcategoryAction, {
						success() {
							onSuccess();
						},
						error(result) {
							toast.error({
								title: 'Failed to create subcategory',
								description: result.error,
							});
						},
					})}
				>
					<input
						type='hidden'
						name={subcategories.categoryId.name}
						defaultValue={categoryId}
					/>
					<Input name={subcategories.name.name} className='border-black' />
					<SubmitButton size='sm' className='m-2 h-full'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
