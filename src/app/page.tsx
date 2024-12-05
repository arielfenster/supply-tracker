import { AppRoutes } from '$/lib/routes';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';

export default async function Home() {
	redirect(await isLoggedIn() ? AppRoutes.PAGES.DASHBOARD : AppRoutes.AUTH.LOGIN);
}
