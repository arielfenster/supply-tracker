'use server';

import { ServerActionState } from '$/lib/types';
import { logoutUser } from '$/services/auth/login.service';

export async function logoutUserAction(): Promise<ServerActionState> {
	try {
		await logoutUser();
		return {
			success: true,
			message: '',
		};
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message,
		};
	}
}
