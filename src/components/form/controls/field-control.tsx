'use client';

import { PropsWithChildren } from 'react';

interface FieldControlProps extends PropsWithChildren {}

export function FieldControl({ children }: FieldControlProps) {
	return <fieldset className='flex flex-col items-start my-2 w-full'>{children}</fieldset>;
}
