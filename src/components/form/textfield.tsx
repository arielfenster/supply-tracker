'use client';

import { ReactNode, forwardRef } from 'react';
import { ErrorControl } from './controls/error-control';
import { FieldControl } from './controls/field-control';
import { LabelControl } from './controls/label-control';
import { FieldErrorProps } from './field-error';
import { Input, InputProps } from './input';

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
		<FieldControl>
			<LabelControl label={label} name={name}>
				<ErrorControl error={error}>
					<div className='relative flex w-full items-center justify-between'>
						{startIcon && <div className='absolute left-2'>{startIcon}</div>}
						<Input name={name} id={name} {...rest} ref={ref} />
						{endIcon && <div className='absolute right-2'>{endIcon}</div>}
					</div>
				</ErrorControl>
			</LabelControl>
		</FieldControl>
	);
});
