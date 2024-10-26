'use client';

import { useFormSubmission } from '$/hooks/useFormSubmission';
import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { AppRoutes } from '$/lib/redirect';
import { LoginInput, loginSchema } from '$/schemas/auth/login.schema';
import Link from 'next/link';
import { loginUserAction } from '../actions';

export function LoginFormContainer() {
	return (
		<div className='w-1/3 flex flex-col'>
			<LoginForm />

			<div className='mt-4 text-center'>
				Don&apos;t have an account?
				<Link href={AppRoutes.AUTH.SIGNUP} className='text-blue-600 px-2'>
					Create now
				</Link>
			</div>
		</div>
	);
}

function LoginForm() {
	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<LoginInput>({
		schema: loginSchema,
		action: loginUserAction,
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
			<SubmitButton>Login</SubmitButton>
		</form>
	);
}
