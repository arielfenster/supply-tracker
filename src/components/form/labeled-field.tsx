'use client';

import { HTMLProps, PropsWithChildren } from 'react';
import { FieldError, FieldErrorProps } from './field-error';
import { Label } from './label';

interface LabeledFieldProps
	extends FieldErrorProps,
		Omit<HTMLProps<HTMLLabelElement>, 'label'>,
		PropsWithChildren {
	label: string;
}

export function LabeledField({
	name,
	error,
	label,
	required,
	children,
	...rest
}: LabeledFieldProps) {
	return (
		<fieldset className='flex flex-col items-start my-2 w-full'>
			<Label htmlFor={name} className='mb-2' {...rest}>
				{label}
				{required && <span className='text-red-500 align-middle'> *</span>}
			</Label>
			<div className='relative flex w-full items-center justify-between'>{children}</div>
			<FieldError error={error} />
		</fieldset>
	);
}
