export type ServerActionSuccess = { success: true; message: string };
export type ServerActionError = { success: false; error: string };
export type ServerActionState = ServerActionSuccess | ServerActionError;

export type ServerActionFunction = (formData: FormData) => Promise<ServerActionState>;

export type ServerActionToasts = {
	success?: (result: ServerActionSuccess) => void;
	error?: (result: ServerActionError) => void;
};

export type PageParams<TParams = Record<string, string>, TSearchParams = Record<string, string>> = {
	params: TParams;
	searchParams: TSearchParams;
};
