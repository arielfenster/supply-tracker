import { ZodObject } from 'zod';
import { objectKeys } from './types';

export function formDataToObject<T extends ZodObject<any>>(
	formData: FormData,
	schema: T,
): Record<keyof T['shape'], any> {
	const res = {} as any;

	objectKeys(schema.shape).forEach((key) => {
		res[key] = formData.get(key as string);
	});

	return res;
}
