import { Navbar } from './navbar';

export default function ManageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<header className='flex items-baseline h-16 border-b border-neutral-300'>
				<h2 className='text-lg font-semibold pl-6 pt-4 w-[240px] h-full border-neutral-300'>
					Supply Tracker
				</h2>
				<Navbar />
			</header>
			{children}
		</>
	);
}
