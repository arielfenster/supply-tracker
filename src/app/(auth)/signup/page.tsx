import { AppRoutes } from '$/lib/routes';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { SignupFormContainer } from './form';

export default async function SignupPage() {
	if (await isLoggedIn()) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8 text-center'>Signup to Supply Tracker!</h1>
			<SignupFormContainer />
		</main>
	);
}
