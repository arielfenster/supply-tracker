'use client';

import { useFormStore } from '$/stores/form.store';
import { PropsWithChildren } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface SubmitButtonProps extends PropsWithChildren, ButtonProps {}

export function SubmitButton({ children, ...rest }: SubmitButtonProps) {
	const pending = useFormStore((store) => store.pending);

	return (
		<Button type='submit' className='flex gap-3' {...rest}>
			{pending ? <Spinner /> : children}
		</Button>
	);
}
