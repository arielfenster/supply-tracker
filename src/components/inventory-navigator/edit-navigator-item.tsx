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
import { useFormStore } from '$/stores/form.store';
import { Settings } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

interface Props {
	navigatorItem: Category | Subcategory;
	updateAction: ServerActionFunction;
	deleteAction: ServerActionFunction;
}

export function EditNavigatorItemFormContainer({
	navigatorItem,
	updateAction,
	deleteAction,
}: Props) {
	const [formKey, setFormKey] = useState(() => nanoid());

	return (
		<EditNavigatorItemFormDialog
			key={formKey}
			navigatorItem={navigatorItem}
			updateAction={updateAction}
			deleteAction={deleteAction}
			onSuccess={() => setFormKey(nanoid())}
		/>
	);
}

function EditNavigatorItemFormDialog({
	navigatorItem,
	updateAction,
	deleteAction,
	onSuccess,
}: Props & { onSuccess: () => void }) {
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
					<DialogTitle>Rename {navigatorItem.name}</DialogTitle>
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
					<input name='id' type='hidden' defaultValue={navigatorItem.id} />
					{/* TODO: maybe split this form into 2 separate forms for category and subcategory to avoid this ugly workaround */}
					{(navigatorItem as Subcategory).categoryId && (
						<input
							name={subcategories.categoryId.name}
							type='hidden'
							defaultValue={(navigatorItem as Subcategory).categoryId}
						/>
					)}
					{(navigatorItem as Category).inventoryId && (
						<input
							name={categories.inventoryId.name}
							type='hidden'
							defaultValue={(navigatorItem as Category).inventoryId}
						/>
					)}
					<Input name='name' defaultValue={navigatorItem.name} />
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
