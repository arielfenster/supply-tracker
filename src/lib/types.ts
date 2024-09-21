export function objectKeys<TObj extends Record<string, any>>(obj: TObj): (keyof TObj)[] {
	return Object.keys(obj);
}

export type ServerActionSuccess = { success: true; message: string };
export type ServerActionError = { success: false; error: string };
export type ServerActionState = ServerActionSuccess | ServerActionError;
