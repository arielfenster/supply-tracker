'use client';

import { AppRoutes } from '$/lib/redirect';
import Link from 'next/link';
import { useState } from 'react';
import { loginUserAction } from '../actions';
import { LoginForm } from './form';

export function LoginFormContainer() {
	const [loginError, setLoginError] = useState('');

	return (
		<div className='w-1/3 flex flex-col'>
			<LoginForm
				onSubmit={async (formData) => {
					const result = await loginUserAction(formData);
					if (!result.success) {
						setLoginError(result.error);
					}
				}}
				error={loginError}
			/>

			<div className='mt-4 text-center'>
				Don&apos;t have an account?
				<Link href={AppRoutes.AUTH.SIGNUP} className='text-blue-600 px-2'>
					Create now
				</Link>
			</div>
		</div>
	);
}
