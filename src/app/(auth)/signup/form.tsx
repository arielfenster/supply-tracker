'use client';

import { useFormSubmission } from '$/hooks/useFormSubmission';
import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { AppRoutes } from '$/lib/routes';
import { SignupInput, signupSchema } from '$/schemas/auth/signup.schema';
import Link from 'next/link';
import { signupUserAction } from '../actions';

export function SignupFormContainer() {
	return (
		<div className='w-2/3 lg:w-1/3 flex flex-col'>
			<SignupForm />

			<div className='mt-4 text-center'>
				Already have an account?
				<Link href={AppRoutes.AUTH.LOGIN} className='text-blue-600 px-2'>
					Login
				</Link>
			</div>
		</div>
	);
}

function SignupForm() {
	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<SignupInput>({
		schema: signupSchema,
		action: signupUserAction,
		toasts: {
			success(result) {
				toast.success({
					title: result.message,
				});
			},
			error(result) {
				toast.error({
					title: 'Failed to login',
					description: result.error,
				});
			},
		},
	});

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(handleFormSubmit)} ref={formRef}>
			<TextField {...register('email')} error={errors.email?.message} label='Email' required />
			<PasswordField {...register('password')} error={errors.password?.message} required />
			<SubmitButton>Signup</SubmitButton>
		</form>
	);
}
