import { Button } from '$/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$/components/ui/card';
import {
	UserInventory,
	getItemQuantitiesForInventory,
	getTotalItemsCountForInventory,
} from '$/data-access/inventories';
import { ArrowRight, Package } from 'lucide-react';

interface InventoryCardProps {
	inventory: UserInventory;
}

export async function InventoryCard({ inventory }: InventoryCardProps) {
	// const percentages = {
	// 	inStock: 50,
	// 	warning: 30,
	// 	danger: 10,
	// 	outOfStock: 10,
	// };
	const totalItems = await getTotalItemsCountForInventory(inventory.id);
	await getItemQuantitiesForInventory(inventory.id);

	return (
		<Card className='w-full max-w-md bg-neutral-50'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-2xl font-bold'>{inventory.name}</CardTitle>
				<Package className='h-6 w-6 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-sm text-muted-foreground mb-4'>
					Last updated: {new Date().toISOString()}
				</div>
				<div className='text-3xl font-bold mb-4'>{totalItems} items</div>
				{/* <div className='w-full h-2 bg-gray-200 rounded-full flex'>
					<div className='h-full bg-green-500' style={{ width: `${percentages.inStock}%` }} />
					<div className='h-full bg-orange-500' style={{ width: `${percentages.warning}%` }} />
					<div className='h-full bg-red-500' style={{ width: `${percentages.danger}%` }} />
					<div className='h-full bg-gray-900' style={{ width: `${percentages.outOfStock}%` }} />
				</div>
				<div className='flex justify-between text-sm mt-2'>
					<span>{Math.round(percentages.inStock)}% In Stock</span>
					<span>{Math.round(percentages.outOfStock)}% Out of Stock</span>
				</div> */}
			</CardContent>
			<CardFooter>
				<Button className='w-full'>
					View Inventory <ArrowRight className='ml-2 h-4 w-4' />
				</Button>
			</CardFooter>
		</Card>
	);
}
