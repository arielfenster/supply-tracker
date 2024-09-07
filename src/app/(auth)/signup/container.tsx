'use client';

import { AppRoutes } from '$/lib/redirect';
import Link from 'next/link';
import { useState } from 'react';
import { signupUserAction } from '../actions';
import { SignupForm } from './form';

export function SignupFormContainer() {
	const [signupError, setSignupError] = useState('');

	return (
		<div className='w-1/3 flex flex-col'>
			<SignupForm
				onSubmit={async (formData) => {
					const result = await signupUserAction(formData);
					if (!result.success) {
						setSignupError(result.error);
					}
				}}
				error={signupError}
			/>

			<div className='mt-4 text-center'>
				Already have an account?
				<Link href={AppRoutes.AUTH.LOGIN} className='text-blue-600 px-2'>
					Login
				</Link>
			</div>
		</div>
	);
}
