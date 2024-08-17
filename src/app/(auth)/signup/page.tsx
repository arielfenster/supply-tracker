import { AppRoutes, appRedirect } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { SignupFormContainer } from './container';

export default function SignupPage() {
	if (isLoggedIn()) {
		appRedirect(AppRoutes.PAGES.BROWSE);
	}

	return (
		<main id='signup-page' className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8'>Signup to Supply Tracker!</h1>
			<SignupFormContainer />
		</main>
	);
}
