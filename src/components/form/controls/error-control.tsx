'use client';

import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorProps } from '../field-error';

interface ErrorControlProps extends FieldErrorProps, PropsWithChildren {
	className?: string;
}

export function ErrorControl({ className, error, children }: ErrorControlProps) {
	return (
		<>
			{children}
			<FieldError error={error} />
		</>
	);
}
