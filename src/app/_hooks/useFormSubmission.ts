import { useToast } from '$/components/hooks/use-toast';
import { useFormStore } from '$/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';
import { ZodSchema, ZodTypeDef } from 'zod';

export function useFormSubmission<TInput extends Record<string, any>>(
	schema: ZodSchema<any, ZodTypeDef, TInput>,
	defaultValues?: DefaultValues<TInput>
) {
	const formRef = useRef<HTMLFormElement>(null);
	const formMethods = useForm<TInput>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	return {
		formRef,
		formMethods,
		setPending,
		toast,
	};
}
