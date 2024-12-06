import * as React from 'react';

import { cn } from '$/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, name, startIcon, endIcon, ...props }, ref) => {
		return (
			<div className='relative flex w-full items-center justify-between'>
				{startIcon && <div className='absolute left-2'>{startIcon}</div>}
				<input
					type={type}
					className={cn(
						'flex h-10 w-full rounded-md border border-black bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium',
						className,
					)}
					ref={ref}
					name={name}
					id={name}
					{...props}
				/>
				{endIcon && <div className='absolute right-2'>{endIcon}</div>}
			</div>
		);
	},
);
Input.displayName = 'Input';

export { Input };
