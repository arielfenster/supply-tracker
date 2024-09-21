import { UserInventoryNew } from './actions';

interface InventoriesViewProps {
	inventories: UserInventoryNew[];
}

export function InventoriesView({ inventories }: InventoriesViewProps) {
	return <div>Hello from InventoriesView</div>;
}
