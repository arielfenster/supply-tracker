import { InventoryWithOwner } from '$/services/inventories.service';
import { CreateInventoryForm } from './create-inventory-form';
import { InventoryCard } from './inventory-card';

interface InventoriesViewProps {
	inventories: InventoryWithOwner[];
	currentUserId: string;
}

export function InventoriesView({ inventories, currentUserId }: InventoriesViewProps) {
	return (
		<>
			<div className='w-full lg:w-1/3 border-2 rounded-md p-4 mt-4'>
				<h3 className='text-lg mb-2'>Create a New Inventory</h3>
				<CreateInventoryForm />
			</div>
			<div className='flex flex-wrap gap-6 my-8'>
				{inventories.map((inventory) => (
					<InventoryCard key={inventory.id} inventory={inventory} currentUserId={currentUserId} />
				))}
			</div>
		</>
	);
}
