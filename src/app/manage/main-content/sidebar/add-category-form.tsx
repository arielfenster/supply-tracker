'use client';

import { Button } from '$/components/form/button';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { Plus } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { addCategoryAction } from './actions';

export function AddCategoryFormContainer() {
	const [showForm, setShowForm] = useState(false);
	const [state, formAction] = useFormState(addCategoryAction, { success: false, error: '' });
	const formRef = useRef<HTMLFormElement>(null);

	if (state.success && showForm) {
		formRef.current?.reset();
		setShowForm(false);
	}

	return showForm ? (
		<>
			<AddCategoryForm
				ref={formRef}
				onSubmit={formAction}
				error={!state.success ? state.error : ''}
			/>
			<Button size='sm' onClick={() => setShowForm(false)}>
				Cancel
			</Button>
		</>
	) : (
		<Button onClick={() => setShowForm(true)}>
			<Plus height={20} />
			<span>Add category</span>
		</Button>
	);
}

type AddCategoryFormProps = {
	onSubmit: (data: FormData) => void;
	error: string;
};

const AddCategoryForm = forwardRef<HTMLFormElement, AddCategoryFormProps>(function AddCategoryForm(
	{ onSubmit, error },
	ref,
) {
	return (
		<form className='flex gap-2 items-center' action={onSubmit} ref={ref}>
			<TextField
				name='category'
				placeholder='Category'
				className='border-black'
				label=''
				error={error}
			/>
			<SubmitButton size='sm' variant='success' className='mb-2'>
				Add
			</SubmitButton>
		</form>
	);
});
