'use client';

import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import { Spinner } from '../ui/spinner';
import { Button, ButtonProps } from './button';

interface SubmitButtonProps extends PropsWithChildren, ButtonProps {}

export function SubmitButton({ children, ...rest }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' className='flex gap-3' {...rest}>
			{pending ? <Spinner /> : children}
		</Button>
	);
}
