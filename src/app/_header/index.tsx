import { getCurrentUser } from '$/lib/auth';
import { Navbar } from './navbar';

export async function Header() {
	const user = await getCurrentUser();

	return (
		<header className='flex items-baseline h-16 border-b border-neutral-300'>
			<h2 className='text-lg font-semibold pl-6 pt-4 w-[240px] h-full border-neutral-300'>
				Supply Tracker
			</h2>
			{!!user && <Navbar />}
		</header>
	);
}
