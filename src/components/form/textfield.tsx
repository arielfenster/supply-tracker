'use client';

import { ReactNode, forwardRef } from 'react';
import { FieldError, FieldErrorProps } from './field-error';
import { Input, InputProps } from './input';
import { Label } from './label';

export type TextFieldProps = InputProps &
	FieldErrorProps & {
		label: string;
		startIcon?: ReactNode;
		endIcon?: ReactNode;
	};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
	{ name, error, label, startIcon, endIcon, required, ...rest },
	ref,
) {
	return (
		<fieldset className='flex flex-col items-start my-2 w-full'>
			<Label htmlFor={name} className='mb-2'>
				{label}
				{required && <span className='text-red-500 align-middle'> *</span>}
			</Label>
			<div className='relative flex w-full items-center justify-between'>
				{startIcon && <div className='absolute left-2'>{startIcon}</div>}
				<Input name={name} id={name} {...rest} ref={ref} />
				{endIcon && <div className='absolute right-2'>{endIcon}</div>}
			</div>
			<div className='mt-1'>
				<FieldError error={error} />
			</div>
		</fieldset>
	);
});
