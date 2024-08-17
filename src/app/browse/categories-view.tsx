import { Button } from '$/components/form/button';
import { Card, CardContent, CardFooter } from '$/components/ui/card';
import Image from 'next/image';

interface CategoriesViewProps {}

export function CategoriesView({}: CategoriesViewProps) {
	return (
		<div>
			<div className='flex gap-4 mt-4'>
				<Button size='lg' className='text-lg'>
					Pantry
				</Button>
				<Button variant='outline' size='lg' className='text-lg'>
					Cleaning Supplies
				</Button>
			</div>
			<div className='flex gap-4 mt-4'>
				<Button size='lg' className='text-lg'>
					All
				</Button>
				<Button variant='outline' size='lg' className='text-lg'>
					Cooking
				</Button>
				<Button variant='outline' size='lg' className='text-lg'>
					Bathroom
				</Button>
				<Button variant='outline' size='lg' className='text-lg'>
					Laundry
				</Button>
			</div>
			<div className='flex flex-wrap gap-8 mt-10'>
				<Card className='relative'>
					<CardContent className='p-10'>
						<Image
							src='/vercel.svg'
							alt='name'
							width={250}
							height={250}
							className='object-cover rounded-t-lg'
						/>
						<div className='mt-4'>
							<h3 className='text-lg font-bold'>name</h3>
							<p className='text-sm text-gray-500'>subcategory</p>
							<p className='text-sm text-gray-500'>5 in stock</p>
						</div>
					</CardContent>
					<CardFooter className='flex justify-end gap-2'>
						<Button variant='outline' size='sm'>
							Edit
						</Button>
						<Button variant='destructive' size='sm'>
							Delete
						</Button>
					</CardFooter>
				</Card>
				<Card className='relative'>
					<CardContent className='p-10'>
						<Image
							src='/vercel.svg'
							alt='name'
							width={250}
							height={250}
							className='object-cover rounded-t-lg'
						/>
						<div className='mt-4'>
							<h3 className='text-lg font-bold'>name</h3>
							<p className='text-sm text-gray-500'>subcategory</p>
							<p className='text-sm text-gray-500'>5 in stock</p>
						</div>
					</CardContent>
					<CardFooter className='flex justify-end gap-2'>
						<Button variant='outline' size='sm'>
							Edit
						</Button>
						<Button variant='destructive' size='sm'>
							Delete
						</Button>
					</CardFooter>
				</Card>
				<Card className='relative'>
					<CardContent className='p-10'>
						<Image
							src='/vercel.svg'
							alt='name'
							width={250}
							height={250}
							className='object-cover rounded-t-lg'
						/>
						<div className='mt-4'>
							<h3 className='text-lg font-bold'>name</h3>
							<p className='text-sm text-gray-500'>subcategory</p>
							<p className='text-sm text-gray-500'>5 in stock</p>
						</div>
					</CardContent>
					<CardFooter className='flex justify-end gap-2'>
						<Button variant='outline' size='sm'>
							Edit
						</Button>
						<Button variant='destructive' size='sm'>
							Delete
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
