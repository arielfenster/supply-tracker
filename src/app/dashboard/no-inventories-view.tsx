import { CreateInventoryForm } from './create-inventory-form';


export function NoInventoriesView() {
	return (
		<div className='mt-2'>
			<h2 className='text-lg'>
				You don&apos;t have any inventories. Click the button to create your first inventory and
				start your tracking journey!
			</h2>
			<div className='w-full lg:w-1/3 border-2 rounded-md p-4 mt-4'>
				<CreateInventoryForm />
			</div>
		</div>
	);
}
