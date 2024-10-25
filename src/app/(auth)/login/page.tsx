import { LoginFormContainer } from './form';

export default function LoginPage() {
	return (
		<main id='login-page' className='h-screen flex flex-col items-center justify-center'>
			<h1 className='text-4xl mb-8'>Login now!</h1>
			<LoginFormContainer />
		</main>
	);
}
