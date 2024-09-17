import { AppRoutes, appRedirect } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';

export default function Home() {
	appRedirect(isLoggedIn() ? AppRoutes.PAGES.INVENTORY : AppRoutes.AUTH.LOGIN);
}
