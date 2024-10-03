'use client';

import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorProps } from '../field-error';

interface ErrorControlProps extends FieldErrorProps, PropsWithChildren {}

export function ErrorControl({ error, children }: ErrorControlProps) {
	return (
		<>
			{children}
			<FieldError error={error} />
		</>
	);
}
