import { Button } from '$/components/ui/button';
import { Input } from '$/components/form/input';
import { getUserCategories } from '$/data-access/categories';
import { CategoriesView } from './categories-view';
import { NoCategoriesView } from './no-categories-view';

export default async function BrowsePage() {
	const userCategories = await getUserCategories('');
	const dataExists = userCategories.length > 0;

	return (
		<main className='container mt-12 w-full'>
			<div className='flex justify-between'>
				<h1 className='text-4xl'>Pantry and Cleaning Supplies</h1>
				{dataExists && (
					<div className='flex gap-2'>
						<Input className='text-lg py-4 px-4' placeholder='Search items...' />
						<Button className='text-lg' size='lg'>
							Add Item
						</Button>
					</div>
				)}
			</div>
			{dataExists ? <CategoriesView /> : <NoCategoriesView />}
		</main>
	);
}
