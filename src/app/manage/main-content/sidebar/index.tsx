'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '$/components/ui/accordion';
import { cn } from '$/lib/utils';
import { Package } from 'lucide-react';
import { UserCollections } from '../../actions';
import { AddCategoryFormContainer } from './add-category-form';
import { AddSubcategoryFormContainer } from './add-subcategory-form';

interface SidebarProps {
	collections: UserCollections;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
	onSelectCategory: (categoryId: string) => void;
	onSelectSubcategory: (subcategoryId: string) => void;
}

export function Sidebar({
	collections,
	selectedCategoryId,
	selectedSubcategoryId,
	onSelectCategory,
	onSelectSubcategory,
}: SidebarProps) {
	return (
		<div className='flex flex-col gap-8 w-60 bg-neutral-100 h-screen border-r border-neutral-300'>
			<div className='flex flex-col gap-4'>
				<Accordion type='single' defaultValue={selectedCategoryId} collapsible>
					{collections.map((collection) => (
						<AccordionItem
							value={collection.id}
							key={collection.id}
							className='border-t border-b w-full border-neutral-300 px-2'
						>
							<AccordionTrigger
								className='mx-2 h-12'
								onClick={() => onSelectCategory(collection.id)}
							>
								<div className='flex items-center gap-2 pl-2 py-2'>
									<Package className='h-4 w-4' />
									<span className='text-lg font-semibold'>{collection.name}</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className='max-h-56 overflow-auto'>
								<div className='mx-5 flex flex-col gap-4'>
									<ul className='flex flex-col gap-3'>
										{collection.subcategories.map((subcategory) => (
											<li
												className={cn(
													'text-base h-7 cursor-pointer hover:bg-neutral-300 rounded-sm transition-all duration-300',
													subcategory.id === selectedSubcategoryId && 'bg-neutral-300',
												)}
												key={subcategory.id}
												onClick={() => onSelectSubcategory(subcategory.id)}
											>
												{subcategory.name}
											</li>
										))}
									</ul>
									<AddSubcategoryFormContainer
										categoryId={selectedCategoryId}
										subcategories={collection.subcategories}
									/>
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>

			<AddCategoryFormContainer collections={collections} />
		</div>
	);
}
