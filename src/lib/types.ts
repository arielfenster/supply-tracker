export function objectKeys<TObj extends Record<string, any>>(obj: TObj): (keyof TObj)[] {
	return Object.keys(obj);
}

type SuccessActionState = { success: true; message: string };
type ErrorActionState = { success: false; error: string };
export type ActionStateType = SuccessActionState | ErrorActionState;
