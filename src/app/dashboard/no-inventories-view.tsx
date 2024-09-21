import { CreateInventoryForm } from './create-inventory-form';

interface NoInventoriesViewProps {}

export function NoInventoriesView({}: NoInventoriesViewProps) {
	return (
		<div>
			<h2 className='text-lg'>You don&apos;t have any inventories.</h2>
			<span className='text-md'>
				Click the button to create your first inventory and start your tracking journey!
			</span>
			<CreateInventoryForm />
		</div>
	);
}
