import { ErrorControl } from '$/components/form/controls/error-control';
import { FieldControl } from '$/components/form/controls/field-control';
import { LabelControl } from '$/components/form/controls/label-control';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { Item, items, measurementUnits } from '$/db/schemas';
import { useFormSubmission } from '$/hooks/useFormSubmission';
import { capitalize } from '$/lib/utils';
import { SubmitItemInput, submitItemSchema } from '$/schemas/items/submit-item.schema';
import { Controller } from 'react-hook-form';
import { submitItemAction } from './actions';

type FormType = 'add' | 'update';

interface Props {
	item?: Item;
	subcategoryId: string;
	onSuccess?: () => void;
}

export function ItemForm({ item, subcategoryId, onSuccess }: Props) {
	const formType: FormType = item ? 'update' : 'add';

	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
			control,
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<SubmitItemInput>({
		schema: submitItemSchema,
		defaultValues: { ...item, subcategoryId },
		action: submitItemAction,
		toasts: {
			success() {
				toast.success({ title: formType === 'add' ? 'Item added' : 'Item updated' });
				onSuccess?.();
			},
			error(result) {
				toast.error({
					title: `Failed to ${formType} item`,
					description: result.error,
				});
			},
		},
	});

	return (
		<form
			className='flex flex-wrap items-center'
			onSubmit={handleSubmit(handleFormSubmit)}
			ref={formRef}
		>
			<div className='flex w-full'>
				<input type='hidden' {...register('id')} />
				<input type='hidden' {...register('subcategoryId')} />
				<TextField
					label='Name'
					id={items.name.name}
					error={errors.name?.message}
					{...register('name')}
				/>
			</div>
			<div className='flex w-full gap-8'>
				<Controller
					control={control}
					name='measurement'
					render={({ field }) => (
						<FieldControl>
							<LabelControl label='Unit of Measurement' name={items.measurement.name}>
								<ErrorControl error={errors.measurement?.message}>
									<Select name={field.name} onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className='border-black' id={items.measurement.name}>
											<SelectValue placeholder='Select measurement' />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{measurementUnits.map((measurement) => (
													<SelectItem key={measurement} value={measurement}>
														{measurement}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</ErrorControl>
							</LabelControl>
						</FieldControl>
					)}
				/>
				<TextField
					label='Quantity'
					id={items.quantity.name}
					placeholder='0'
					error={errors.quantity?.message}
					{...register('quantity')}
				/>
			</div>
			<div className='flex w-full gap-8'>
				<TextField
					label='Warning threshold'
					id={items.warningThreshold.name}
					placeholder='0'
					error={errors.warningThreshold?.message}
					{...register('warningThreshold')}
				/>
				<TextField
					label='Danger threshold'
					id={items.dangerThreshold.name}
					placeholder='0'
					error={errors.dangerThreshold?.message}
					{...register('dangerThreshold')}
				/>
			</div>
			<div className='w-full mt-4'>
				<SubmitButton className='w-full'>{capitalize(formType)} Item</SubmitButton>
			</div>
		</form>
	);
}
