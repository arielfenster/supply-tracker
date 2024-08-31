'use server';

import { ActionStateType } from '$/lib/types';

export async function meow(_state: ActionStateType, formData: FormData): Promise<ActionStateType> {
	console.log(_state);
	console.log(formData);
	return {
		success: true,
		message: 'bazinga',
	};
}
