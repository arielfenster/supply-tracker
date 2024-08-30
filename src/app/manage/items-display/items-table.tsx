'use client';

import { Item } from '$/db/schemas';
import { cn } from '$/lib/utils';

interface ItemsTableProps {
	items: Item[];
}

export function ItemsTable({ items }: ItemsTableProps) {
	function getQuantityClassName(item: Item) {
		const { quantity, dangerThreshold, warningThreshold } = item;

		if (quantity === 0) return 'bg-black text-white';
		if (quantity <= dangerThreshold) return 'bg-red-500 text-white';
		if (quantity <= warningThreshold) return 'bg-orange-400 text-white';

		return '';
	}

	return (
		<table className='min-w-full bg-white shadow-md rounded-lg'>
			<thead>
				<tr>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Name
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Quantity
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Warning
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Danger
					</th>
					<th className='pl-4 py-3 bg-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{items.map((item) => (
					<tr key={item.id} className='border-t-4 border-gray-200 *:w-1/5'>
						<td className='px-4 py-4 text-sm text-gray-700'>{item.name}</td>
						<td className={cn('px-4 py-4 text-sm text-gray-700', getQuantityClassName(item))}>
							{item.quantity}
						</td>
						<td className='pl-4 py-4 text-sm text-gray-700'>{item.warningThreshold}</td>
						<td className='pl-4 py-4 text-sm text-gray-700'>{item.dangerThreshold}</td>
						{/* add save, delete and reorder actions */}
					</tr>
				))}
			</tbody>
		</table>
	);
}
