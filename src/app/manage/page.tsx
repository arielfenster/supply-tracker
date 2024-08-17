import { getUserCategoriesWithSubCategories } from '$/data-access/categories';
import { CreateCategoryForm } from './create-category-form';

export default async function ManagePage() {
	const data = [] || (await getUserCategoriesWithSubCategories(''));

	return (
		<main className='container mt-10 flex flex-col gap-4'>
			<div>
				<h1 className='text-4xl'>Category and Subcategory Management</h1>
			</div>
			<div className='flex flex-col gap-10'>
				<h3 className='text-2xl'>Create a main category</h3>
				<CreateCategoryForm />
			</div>
		</main>
	);
}
