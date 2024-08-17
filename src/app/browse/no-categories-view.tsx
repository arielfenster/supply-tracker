'use client';

import { Button } from '$/components/form/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NoCategoriesViewProps {}

export function NoCategoriesView({}: NoCategoriesViewProps) {
	const router = useRouter();

	return (
		<div className='mt-4 flex gap-2'>
			<h3 className='text-xl'>
				You don&apos;t have any data listed. Go to the manage page and insert info
			</h3>
			<Link href='/manage'>
				<Button onClick={() => router.push('/manage')}>Manage</Button>
			</Link>
		</div>
	);
}
