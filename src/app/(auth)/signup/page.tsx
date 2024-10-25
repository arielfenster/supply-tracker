import { SignupFormContainer } from './form';

export default function SignupPage() {
	return (
		<main id='signup-page' className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8'>Signup to Supply Tracker!</h1>
			<SignupFormContainer />
		</main>
	);
}
