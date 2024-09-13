'use client';

import { SubmitButton } from '$/components/form/submit-button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '$/components/ui/dropdown-menu';
import { AppRoutes } from '$/lib/redirect';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUserAction } from './sidebar/actions';

export function Navbar() {
	const router = useRouter();

	return (
		<nav>
			<ul className='flex gap-4'>
				<li className='text-lg underline hover:opacity-50'>
					<Link href={AppRoutes.PAGES.MANAGE}>Inventory</Link>
				</li>
				<li className='text-lg underline hover:opacity-50 absolute right-6'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<UserCircle className='h-8 w-8 cursor-pointer' />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Link href={AppRoutes.PAGES.USER}>Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<form
									action={async () => {
										await logoutUserAction();
										router.push(AppRoutes.AUTH.LOGIN);
									}}
								>
									<SubmitButton className='p-0 font-normal hover:no-underline' variant='link'>
										Logout
									</SubmitButton>
								</form>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</li>
			</ul>
		</nav>
	);
}
