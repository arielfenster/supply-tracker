'use client';

import { cn } from '$/lib/utils';

interface QuantityUnitFieldProps {
	quantity: string;
	measurement: string;
	quantityClassName?: string;
}

export function QuantityUnitField({
	quantity,
	measurement,
	quantityClassName,
}: QuantityUnitFieldProps) {
	return (
		<div className='flex'>
			<span
				className={cn(
					'flex items-center h-10 w-full rounded-md border border-black bg-background px-3 py-2 text-sm',
					'border-black font-bold border-r-1 rounded-r-none',
					quantityClassName,
				)}
			>
				{quantity}
			</span>
			<span
				className={cn(
					'flex items-center h-10 w-full rounded-md border border-black bg-background px-3 py-2 text-sm',
					'border-black border-l-0 rounded-l-none',
				)}
			>
				{measurement}
			</span>
		</div>
	);
}
