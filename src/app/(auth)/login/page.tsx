import { AppRoutes } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { LoginFormContainer } from './container';

export default function LoginPage() {
	if (isLoggedIn()) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main id='login-page' className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8'>Login now!</h1>
			<LoginFormContainer />
		</main>
	);
}
