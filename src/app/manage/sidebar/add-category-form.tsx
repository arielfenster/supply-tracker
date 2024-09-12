'use client';

import { Button } from '$/components/form/button';
import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { useToast } from '$/components/hooks/use-toast';
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
import { useState } from 'react';
import { addCategoryAction } from './actions';

export function AddCategoryFormContainer() {
	const [formKey, setFormKey] = useState(() => nanoid());

	return <AddCategoryFormDialog key={formKey} onSuccess={() => setFormKey(nanoid())} />;
}

function AddCategoryFormDialog({ onSuccess }: { onSuccess: () => void }) {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
				<form
					className='flex gap-2 items-center'
					action={async (formData) => {
						const result = await addCategoryAction(formData);
						if (result.success) {
							onSuccess();
						} else {
							toast({
								title: 'Failed to create category',
								description: result.error,
								variant: 'destructive',
							});
						}
					}}
				>
					<Input name='name' className='border-black' />
					<SubmitButton size='sm' variant='success' className='mb-2'>
						Add
					</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
