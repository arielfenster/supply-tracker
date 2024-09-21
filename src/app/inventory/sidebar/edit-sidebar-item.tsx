'use client';

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
import { Category, Subcategory } from '$/db/schemas';
import { ServerActionState } from '$/lib/types';
import { Settings } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

interface EditSidebarItemFormContainerProps {
	updateAction: (formData: FormData) => Promise<ServerActionState>;
	deleteAction: (formData: FormData) => Promise<ServerActionState>;
	item: Category | Subcategory;
}

export function EditSidebarItemFormContainer({
	item,
	updateAction,
	deleteAction,
}: EditSidebarItemFormContainerProps) {
	const [formKey, setFormKey] = useState(() => nanoid());

	return (
		<EditSidebarItemFormDialog
			key={formKey}
			item={item}
			updateAction={updateAction}
			deleteAction={deleteAction}
			onSuccess={() => setFormKey(nanoid())}
		/>
	);
}

type Props = EditSidebarItemFormContainerProps & {
	onSuccess: () => void;
};

function EditSidebarItemFormDialog({ item, onSuccess, updateAction, deleteAction }: Props) {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Settings
					className='h-[18px] w-[18px] hover:opacity-25'
					onClick={(e) => {
						e.stopPropagation();
					}}
				/>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename {item.name}</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>
				<form
					className='flex gap-2 items-center flex-col'
					action={async (formData) => {
						const result = await updateAction(formData);
						if (result.success) {
							onSuccess();
						} else {
							toast({
								title: 'Failed to update',
								description: result.error,
								variant: 'destructive',
							});
						}
					}}
				>
					<input name='id' className='hidden' defaultValue={item.id} />
					<Input name='name' defaultValue={item.name} />
					<div className='flex gap-4 mt-2'>
						<SubmitButton size='sm' variant='success' className='mb-2'>
							Update
						</SubmitButton>
						<SubmitButton
							size='sm'
							variant='destructive'
							className='mb-2'
							formAction={async (formData) => {
								const result = await deleteAction(formData);
								if (result.success) {
									onSuccess();
								} else {
									toast({
										title: 'Failed to delete',
										description: result.error,
										variant: 'destructive',
									});
								}
							}}
						>
							Delete
						</SubmitButton>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
