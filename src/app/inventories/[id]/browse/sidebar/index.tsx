import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '$/components/ui/accordion';
import { Button } from '$/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '$/components/ui/sheet';
import { type UserInventory } from '$/data-access/handlers/inventories.handler';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { cn } from '$/lib/utils';
import { MenuIcon, Package } from 'lucide-react';
import {
	deleteCategoryAction,
	deleteSubcategoryAction,
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
	const { isMobile } = useMediaQuery();

	return isMobile ? (
		<Sheet>
			<SheetTrigger asChild className='block'>
				<Button variant='outline' className='flex gap-1'>
					<MenuIcon className='h-5 w-5' />
					Categories
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='w-72 p-0'>
				<SheetHeader>
					<SheetTitle />
					<SheetDescription />
				</SheetHeader>
				<SidebarContent
					inventory={inventory}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
					onSelectCategory={onSelectCategory}
					onSelectSubcategory={onSelectSubcategory}
				/>
			</SheetContent>
		</Sheet>
	) : (
		<div className='w-[272px] bg-neutral-100 border-r border-neutral-300'>
			<SidebarContent
				inventory={inventory}
				selectedCategoryId={selectedCategoryId}
				selectedSubcategoryId={selectedSubcategoryId}
				onSelectCategory={onSelectCategory}
				onSelectSubcategory={onSelectSubcategory}
			/>
		</div>
	);
}

function SidebarContent({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
	onSelectCategory,
	onSelectSubcategory,
}: SidebarProps) {
	return (
		<div className='flex flex-col h-full md:h-[calc(100vh-4rem)] pb-2'>
			<span className='p-4 text-2xl font-semibold border-b'>Categories</span>
			<div className='flex-grow overflow-y-auto'>
				<Accordion type='single' defaultValue={selectedCategoryId} collapsible>
					{inventory.categories.map((category) => (
						<AccordionItem value={category.id} key={category.id}>
							<AccordionTrigger
								className='mx-2 h-12 hover:no-underline hover:bg-neutral-300'
								onClick={() => onSelectCategory(category.id)}
							>
								<div className='flex items-center justify-between pl-2 pr-4 py-2 w-full'>
									<div className='flex gap-2 items-center'>
										<span className='text-xl'>📦</span>
										<span className='text-lg font-semibold'>{category.name}</span>
									</div>
									{category.id === selectedCategoryId && (
										<EditSidebarItemFormContainer
											sidebarItem={category}
											updateAction={updateCategoryAction}
											deleteAction={deleteCategoryAction}
										/>
									)}
								</div>
							</AccordionTrigger>
							<AccordionContent className='max-h-56 overflow-auto pt-2 pb-4'>
								<div className='mx-5 flex flex-col gap-4'>
									<ul className='flex flex-col gap-3'>
										{category.subcategories.map((subcategory) => (
											<li
												className={cn(
													'flex items-center justify-between text-base h-8 cursor-pointer rounded-md hover:bg-neutral-300 pl-4 pr-5 transition-all duration-300',
													subcategory.id === selectedSubcategoryId && 'bg-neutral-300',
												)}
												key={subcategory.id}
												onClick={() => onSelectSubcategory(subcategory.id)}
											>
												<div className='flex items-center gap-1'>
													<Package className='w-[18px] h-[18px]' />
													{subcategory.name}
												</div>
												{subcategory.id === selectedSubcategoryId && (
													<EditSidebarItemFormContainer
														sidebarItem={subcategory}
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

			<AddCategoryFormContainer inventoryId={inventory.id} />
		</div>
	);
}
