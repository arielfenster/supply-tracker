import { AppRoutes } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { SignupFormContainer } from './container';

export default function SignupPage() {
	if (isLoggedIn()) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main id='signup-page' className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8'>Signup to Supply Tracker!</h1>
			<SignupFormContainer />
		</main>
	);
}
