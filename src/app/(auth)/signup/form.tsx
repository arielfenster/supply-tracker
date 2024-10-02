'use client';

import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useToast } from '$/components/hooks/use-toast';
import { executeServerAction } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { SignupInput, signupSchema } from '$/schemas/auth/signup.schema';
import { useFormStore } from '$/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { signupUserAction } from '../actions';

export function SignupFormContainer() {
	return (
		<div className='w-1/3 flex flex-col'>
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
	const formRef = useRef<HTMLFormElement>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupInput>({
		resolver: zodResolver(signupSchema),
	});

	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(signupUserAction, setPending, {
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
		})(formData);
	}

	return (
		<form className='flex flex-col' onSubmit={handleSubmit(handleFormSubmit)} ref={formRef}>
			<TextField {...register('email')} error={errors.email?.message} label='Email' required />
			<PasswordField {...register('password')} error={errors.password?.message} required />
			<SubmitButton>Signup</SubmitButton>
		</form>
	);
}
