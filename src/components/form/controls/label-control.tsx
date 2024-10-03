'use client';

import { HTMLProps, PropsWithChildren } from 'react';
import { Label } from '../label';

interface LabeledControlProps
	extends Omit<HTMLProps<HTMLLabelElement>, 'label'>,
		PropsWithChildren {
	label: string;
}

export function LabelControl({ name, label, required, children, ...rest }: LabeledControlProps) {
	return (
		<>
			<Label htmlFor={name} className='mb-2' {...rest}>
				{label}
				{required && <span className='text-red-500 align-middle'> *</span>}
			</Label>
			{children}
		</>
	);
}
