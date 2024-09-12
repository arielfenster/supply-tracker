'use client';

import { Button } from '$/components/ui/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '$/components/ui/accordion';
import { AppRoutes } from '$/lib/redirect';
import { cn } from '$/lib/utils';
import { LogOut, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserInventory } from '../actions';
import {
	deleteCategoryAction,
	deleteSubcategoryAction,
	logoutUserAction,
	updateCategoryAction,
	updateSubcategoryAction,
} from './actions';
import { AddCategoryFormContainer } from './add-category-form';
import { AddSubcategoryFormContainer } from './add-subcategory-form';
import { EditSidebarItemFormContainer } from './edit-sidebar-item';

interface SidebarProps {
	inventory: UserInventory;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
	onSelectCategory: (categoryId: string) => void;
	onSelectSubcategory: (subcategoryId: string) => void;
}

export function Sidebar({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
	onSelectCategory,
	onSelectSubcategory,
}: SidebarProps) {
	const router = useRouter();

	return (
		<div className='flex flex-col'>
			<header className='h-16 border-b border-r border-neutral-300'>
				<h2 className='text-lg font-semibold border-r border-neutral-300 pl-6 pt-4'>
					Supply Tracker
				</h2>
			</header>
			<div className='flex flex-col gap-8 w-60 bg-neutral-100 h-screen border-r border-neutral-300'>
				<div className='flex flex-col gap-4'>
					<Accordion type='single' defaultValue={selectedCategoryId} collapsible>
						{inventory.categories.map((category) => (
							<AccordionItem
								value={category.id}
								key={category.id}
								className='border-t border-b w-full border-neutral-300 px-2'
							>
								<AccordionTrigger
									className='mx-2 h-12'
									onClick={() => onSelectCategory(category.id)}
								>
									<div className='flex items-center justify-between pl-2 pr-1 py-2 w-full'>
										<div className='flex gap-2 items-center'>
											<Package className='h-[22px] w-[22px]' />
											<span className='text-lg font-semibold'>{category.name}</span>
										</div>
										{category.id === selectedCategoryId && (
											<EditSidebarItemFormContainer
												item={category}
												updateAction={updateCategoryAction}
												deleteAction={deleteCategoryAction}
											/>
										)}
									</div>
								</AccordionTrigger>
								<AccordionContent className='max-h-56 overflow-auto'>
									<div className='mx-5 flex flex-col gap-4'>
										<ul className='flex flex-col gap-3'>
											{category.subcategories.map((subcategory) => (
												<li
													className={cn(
														'flex items-center justify-between text-base h-8 cursor-pointer hover:bg-neutral-300 rounded-lg px-2 transition-all duration-300',
														subcategory.id === selectedSubcategoryId && 'bg-neutral-300',
													)}
													key={subcategory.id}
													onClick={() => onSelectSubcategory(subcategory.id)}
												>
													{subcategory.name}
													{subcategory.id === selectedSubcategoryId && (
														<EditSidebarItemFormContainer
															item={subcategory}
															updateAction={updateSubcategoryAction}
															deleteAction={deleteSubcategoryAction}
														/>
													)}
												</li>
											))}
										</ul>
										<AddSubcategoryFormContainer categoryId={selectedCategoryId} />
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				<AddCategoryFormContainer />
				<form
					action={async () => {
						await logoutUserAction();
						router.push(AppRoutes.AUTH.LOGIN);
					}}
				>
					<Button className='flex gap-1 w-1/2 mx-auto' variant='ghost'>
						<LogOut />
						<span>Logout</span>
					</Button>
				</form>
			</div>
		</div>
	);
}
