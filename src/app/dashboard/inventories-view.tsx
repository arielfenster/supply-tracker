import { UserInventory } from '$/data-access/inventories';
import { CreateInventoryForm } from './create-inventory-form';
import { InventoryCard } from './inventory-card';

interface InventoriesViewProps {
	inventories: UserInventory[];
}

export function InventoriesView({ inventories }: InventoriesViewProps) {
	return (
		<div className=''>
			<div className='flex flex-wrap gap-4 m-8'>
				{inventories.map((inventory) => (
					<InventoryCard key={inventory.id} inventory={inventory} />
				))}
			</div>

			<div className='w-1/2'>
				<h3 className='text-lg'>Create a new inventory</h3>
				<CreateInventoryForm />
			</div>
		</div>
	);
}
