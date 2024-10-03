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
import { Category, Subcategory, categories, subcategories } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { ServerActionFunction } from '$/lib/types';
import { useFormStore } from '$/stores/form-store';
import { Settings } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

interface EditSidebarItemFormContainerProps {
	updateAction: ServerActionFunction;
	deleteAction: ServerActionFunction;
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
	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	return (
		<Dialog>
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
					action={executeServerAction(updateAction, setPending, {
						success() {
							onSuccess();
						},
						error(result) {
							toast.error({
								title: 'Failed to update',
								description: result.error,
							});
						},
					})}
				>
					<input name='id' type='hidden' defaultValue={item.id} />
					{/* TODO: maybe split this form into 2 separate forms for category and subcategory to avoid this ugly workaround */}
					{(item as Subcategory).categoryId && (
						<input
							name={subcategories.categoryId.name}
							type='hidden'
							defaultValue={(item as Subcategory).categoryId}
						/>
					)}
					{(item as Category).inventoryId && (
						<input
							name={categories.inventoryId.name}
							type='hidden'
							defaultValue={(item as Category).inventoryId}
						/>
					)}
					<Input name='name' defaultValue={item.name} />
					<div className='flex gap-4 mt-2'>
						<SubmitButton size='sm' className='mb-2'>
							Update
						</SubmitButton>
						<SubmitButton
							size='sm'
							variant='destructive'
							className='mb-2'
							formAction={executeServerAction(deleteAction, setPending, {
								success() {
									onSuccess();
								},
								error(result) {
									toast.error({
										title: 'Failed to delete',
										description: result.error,
									});
								},
							})}
						>
							Delete
						</SubmitButton>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
