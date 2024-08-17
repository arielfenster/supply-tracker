'use client';

import { Button } from '$/components/form/button';
import { Input } from '$/components/form/input';
import { Label } from '$/components/form/label';
import { createCategoryAction } from './actions';

interface CreateCategoryFormProps {}

export function CreateCategoryForm({}: CreateCategoryFormProps) {
	return (
		<form className='w-1/3 flex items-end gap-4' action={createCategoryAction}>
			<div className='flex flex-col w-full'>
				<Label htmlFor='category' className='text-lg'>
					Category
				</Label>
				<Input id='category' name='category' />
			</div>
			<div>
				<Button>Add +</Button>
			</div>
		</form>
	);
}
