'use client';

import { AppRoutes } from '$/lib/redirect';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginUserAction } from '../actions';
import { LoginForm } from './form';

export function LoginFormContainer() {
	const [state, formAction] = useFormState(loginUserAction, { success: false, error: '' });

	return (
		<div className='w-1/3 flex flex-col'>
			<LoginForm onSubmit={formAction} error={state.success ? undefined : state.error} />

			<div className='mt-4 text-center'>
				Already have an account?
				<Link href={AppRoutes.AUTH.LOGIN} className='text-blue-600 px-2'>
					Login
				</Link>
			</div>
		</div>
	);
}
