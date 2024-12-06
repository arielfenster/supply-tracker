'use client';

import { cn } from '$/lib/utils';
import { forwardRef } from 'react';
import { ErrorControl } from './controls/error-control';
import { FieldControl } from './controls/field-control';
import { LabelControl } from './controls/label-control';
import { FieldErrorProps } from './field-error';
import { Input, InputProps } from './input';

export type TextFieldProps = InputProps & FieldErrorProps & {
	label: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
	{ name, error, label, required, className, ...rest },
	ref,
) {
	return (
		<FieldControl>
			<LabelControl label={label} name={name} required={required}>
				<ErrorControl error={error}>
					<Input
						name={name}
						id={name}
						className={cn(error && 'border-red-600 outline-red-600 outline-1', className)}
						ref={ref}
						{...rest}
					/>
				</ErrorControl>
			</LabelControl>
		</FieldControl>
	);
});
