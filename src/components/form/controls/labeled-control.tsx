'use client';

import { HTMLProps, PropsWithChildren } from 'react';
import { Label } from '../label';

interface LabeledControlProps
	extends Omit<HTMLProps<HTMLLabelElement>, 'label'>,
		PropsWithChildren {
	label: string;
}

export function LabeledControl({ name, label, required, children, ...rest }: LabeledControlProps) {
	return (
		<fieldset className='flex flex-col items-start my-2 w-full'>
			<Label htmlFor={name} className='mb-2' {...rest}>
				{label}
				{required && <span className='text-red-500 align-middle'> *</span>}
			</Label>
			{children}
		</fieldset>
	);
}
