import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import { Subcategory } from '$/db/schemas';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { ItemForm } from './item-form';

export function AddItemFormContainer({ subcategory }: { subcategory: Subcategory }) {
	const [formKey, setFormKey] = useState(() => nanoid());

	function handleFormSuccess() {
		setFormKey(nanoid());
	}

	return (
		<Dialog key={formKey}>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline'>
					<Plus />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new item</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-foreground'>
					Add a new item to the {subcategory.name} subcategory
				</DialogDescription>
				<ItemForm subcategoryId={subcategory.id} onSuccess={handleFormSuccess} />
			</DialogContent>
		</Dialog>
	);
}
