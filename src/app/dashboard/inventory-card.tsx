import { Button } from '$/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$/components/ui/card';
import {
	ItemQuantityStatus,
	UserInventory,
	getItemQuantitiesForInventory,
	getTotalItemsCountForInventory,
} from '$/data-access/inventories';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

interface InventoryCardProps {
	inventory: UserInventory;
}

export async function InventoryCard({ inventory }: InventoryCardProps) {
	const [totalItems, itemQuantityStats] = await Promise.all([
		getTotalItemsCountForInventory(inventory.id),
		getItemQuantitiesForInventory(inventory.id),
	]);

	return (
		<Card className='w-full max-w-md bg-neutral-50'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-2xl font-bold'>{inventory.name}</CardTitle>
				<Package className='h-6 w-6 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-sm text-muted-foreground mb-4'>
					Last updated: {inventory.updatedAt}
				</div>
				<div className='text-3xl font-bold mb-4'>{totalItems} items</div>
				{/* <StockStatus totalItems={totalItems} itemQuantityStats={itemQuantityStats} /> */}
			</CardContent>
			<CardFooter>
				<Link
					className='w-full'
					href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [inventory.id])}
				>
					<Button className='w-full'>
						View Inventory <ArrowRight className='ml-2 h-4 w-4' />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}

function StockStatus({
	totalItems,
	itemQuantityStats,
}: {
	totalItems: number;
	itemQuantityStats: Record<ItemQuantityStatus, number>;
}) {
	return (
		<>
			<div className='w-full h-2 bg-gray-200 rounded-full flex'>
				<div
					className='h-full bg-green-500'
					style={{ width: `${(itemQuantityStats.inStock / totalItems) * 100}%` }}
				/>
				<div
					className='h-full bg-orange-500'
					style={{ width: `${(itemQuantityStats.warningStock / totalItems) * 100}%` }}
				/>
				<div
					className='h-full bg-red-500'
					style={{ width: `${(itemQuantityStats.dangerStock / totalItems) * 100}%` }}
				/>
				<div
					className='h-full bg-gray-900'
					style={{ width: `${(itemQuantityStats.outOfStock / totalItems) * 100}%` }}
				/>
			</div>
			<div className='flex justify-between text-sm mt-2'>
				<span>{Math.round(((itemQuantityStats.inStock || 0) / totalItems) * 100)}% In Stock</span>
				<span>
					{Math.round(itemQuantityStats.outOfStock || (0 / totalItems) * 100)}% Out of Stock
				</span>
			</div>
		</>
	);
}