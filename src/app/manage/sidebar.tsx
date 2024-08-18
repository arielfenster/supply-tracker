import { Button } from '$/components/form/button';
import { Package, Plus } from 'lucide-react';

interface SidebarProps {
	categories: string[];
}

export function Sidebar({ categories }: SidebarProps) {
	categories = ['Food', 'Medical'];

	return (
		<div className='flex flex-col  gap-8 w-60 bg-neutral-100 h-screen py-4 px-6 border-r border-neutral-300'>
			<div className='flex flex-col gap-4'>
				{categories.map((category) => (
					<div className='flex items-center gap-2 ml-2' key={category}>
						<Package height={18} />
						<span>{category}</span>
					</div>
				))}
			</div>
			<Button>
				<Plus height={20} />
				<span>Add category</span>
			</Button>
		</div>
	);
}
