'use client';

import { Item } from '$/db/schemas';
import { cn } from '$/lib/utils';

interface QuantityMeasurementFieldProps {
	item: Item;
}

export function QuantityMeasurementField({ item }: QuantityMeasurementFieldProps) {
	function getQuantityClassName() {
		const { quantity, dangerThreshold, warningThreshold } = item;

		const intQuantity = Number(quantity);

		if (intQuantity === 0) return 'bg-black text-white';
		if (intQuantity <= dangerThreshold) return 'bg-red-500 text-white';
		if (intQuantity <= warningThreshold) return 'bg-orange-400 text-white';

		return '';
	}

	return (
		<div className='flex'>
			<span
				className={cn(
					'flex items-center h-10 w-full rounded-md border border-black bg-background px-3 py-2 text-sm',
					'border-black font-bold border-r-1 rounded-r-none',
					getQuantityClassName(),
				)}
			>
				{item.quantity}
			</span>
			<span
				className={cn(
					'flex items-center h-10 w-full rounded-md border border-black bg-background px-3 py-2 text-sm',
					'border-black border-l-0 rounded-l-none',
				)}
			>
				{item.measurement}
			</span>
		</div>
	);
}
