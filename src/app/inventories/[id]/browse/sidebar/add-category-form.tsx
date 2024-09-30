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
import { categories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { useFormStore } from '$/stores/form-store';
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
	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

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
					className='flex gap-2 items-center'
					action={executeServerAction(addCategoryAction, setPending, {
						success() {
							onSuccess();
						},
						error(result) {
							toast.error({
								title: 'Failed to create category',
								description: result.error,
							});
						},
					})}
				>
					<input type='hidden' name={categories.inventoryId.name} defaultValue={inventoryId} />
					<Input name={categories.name.name} className='border-black' />
					<SubmitButton size='sm' className='h-full'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
