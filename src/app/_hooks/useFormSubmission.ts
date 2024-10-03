import { useToast } from '$/components/hooks/use-toast';
import { executeServerAction } from '$/lib/forms';
import { ServerActionFunction, ServerActionToasts } from '$/lib/types';
import { useFormStore } from '$/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { ZodSchema, ZodTypeDef } from 'zod';

type Props<TInput> = {
	schema: ZodSchema<any, ZodTypeDef, TInput>;
	defaultValues?: DefaultValues<TInput>;
	action: ServerActionFunction;
	toasts?: ServerActionToasts;
};

export function useFormSubmission<TInput extends Record<string, any>>({
	schema,
	defaultValues,
	action,
	toasts,
}: Props<TInput>) {
	const formRef = useRef<HTMLFormElement>(null);
	const formMethods = useForm<TInput>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(action, setPending, toasts)(formData);
	}

	return {
		formRef,
		formMethods,
		toast,
		handleFormSubmit,
	};
}
