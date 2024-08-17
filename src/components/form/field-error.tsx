export interface FieldErrorProps {
	error?: string;
}

export function FieldError({ error }: FieldErrorProps) {
	return <p className='h-2 text-red-600 mt-1 text-sm pl-0.5'>{error}</p>;
}
