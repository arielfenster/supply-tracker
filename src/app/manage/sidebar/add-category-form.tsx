'use client';

import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useRef } from 'react';
import { useFormState } from 'react-dom';
import { addCategoryAction } from './actions';

export function AddCategoryForm() {
	const [state, formAction] = useFormState(addCategoryAction, { success: false, error: '' });
	const formRef = useRef<HTMLFormElement>(null);

	if (state.success) {
		formRef.current?.reset();
	}

	return (
		<form className='flex gap-2 items-center' action={formAction} ref={formRef}>
			<TextField
				name='category'
				placeholder='Category'
				className='border-black'
				label=''
				error={!state.success ? state.error : ''}
			/>
			<SubmitButton size='sm' variant='success' className='mb-2'>
				Add
			</SubmitButton>
		</form>
	);
}
