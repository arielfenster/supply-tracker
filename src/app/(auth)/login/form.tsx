'use client';

import { Button } from '$/components/form/button';
import { FieldError } from '$/components/form/field-error';
import { PasswordField } from '$/components/form/password-field';
import { TextField } from '$/components/form/textfield';
import { Spinner } from '$/components/ui/spinner';
import { LoginInput, loginSchema } from '$/schemas/auth/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
	error?: string;
	onSubmit: (data: FormData) => void;
}

export function LoginForm({ error, onSubmit }: LoginFormProps) {
	const formRef = useRef<HTMLFormElement>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	function submitForm() {
		onSubmit(new FormData(formRef.current!));
	}

	return (
		<form
			id='signup-form'
			className='flex flex-col'
			onSubmit={handleSubmit(submitForm)}
			ref={formRef}
		>
			<TextField {...register('email')} error={errors.email?.message} label='Email' required />
			<PasswordField {...register('password')} error={errors.password?.message} required />
			<SubmitButton />
			{error && <FieldError error={error} />}
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' className='flex gap-3 mt-4'>
			Login
			{pending && <Spinner />}
		</Button>
	);
}