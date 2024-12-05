import { getCurrentUser } from '$/lib/auth';
import { AppRoutes } from '$/lib/routes';
import { redirect } from 'next/navigation';
import { UserContainer } from './container';

export default async function UserPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	return (
		<main className='w-full h-full'>
			<UserContainer user={user} />
		</main>
	);
}
