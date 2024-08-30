import { Button } from '$/components/form/button';
import { Input } from '$/components/form/input';
import { Plus } from 'lucide-react';

interface ActionsToolbarProps {}

export function ActionsToolbar({}: ActionsToolbarProps) {
	return (
		<header className='grid grid-cols-[240px_1fr] h-16 border-b border-neutral-300'>
			<h2 className='text-lg font-semibold border-r border-neutral-300 pl-6 pt-4'>
				Supply Tracker
			</h2>
			<div className='flex items-center mx-8 gap-8'>
				<Input placeholder='Search items...' />
				<div className='flex gap-2'>
					<Button
						size='sm'
						variant='outline'
						className='border-2 border-black hover:bg-neutral-100'
					>
						<Plus />
						Add Item
					</Button>
				</div>
			</div>
		</header>
	);
}
