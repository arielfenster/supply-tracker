import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useToast } from '$/components/hooks/use-toast';
import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { Subcategory, items, measurementUnits } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { CreateItemInput, createItemSchema } from '$/schemas/items/create-item.schema';
import { useFormStore } from '$/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { addItemAction } from './actions';

export function AddItemFormContainer({ subcategory }: { subcategory: Subcategory }) {
	const [formKey, setFormKey] = useState(() => nanoid());

	function handleFormSuccess() {
		setFormKey(nanoid());
	}

	return (
		<AddItemFormDialog key={formKey} subcategory={subcategory} onSuccess={handleFormSuccess} />
	);
}

function AddItemFormDialog({
	subcategory,
	onSuccess,
}: {
	subcategory: Subcategory;
	onSuccess: () => void;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline'>
					<Plus />
					Add Item
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new item</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-foreground'>
					Add a new item to the {subcategory.name} subcategory
				</DialogDescription>
				<AddItemForm onSuccess={onSuccess} />
			</DialogContent>
		</Dialog>
	);
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
	const formRef = useRef<HTMLFormElement>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<CreateItemInput>({
		resolver: zodResolver(createItemSchema),
	});
	const setPending = useFormStore((store) => store.setPending);
	const { toast } = useToast();

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(addItemAction, setPending, {
			success() {
				toast.success({ title: 'Item added' });
				onSuccess();
			},
			error(result) {
				toast.error({
					title: 'Failed to add item',
					description: result.error,
				});
			},
		})(formData);
	}

	return (
		<form
			className='flex flex-wrap items-center'
			onSubmit={handleSubmit(handleFormSubmit)}
			ref={formRef}
		>
			<div className='flex w-full'>
				<input type='hidden' {...register('subcategoryId')} />
				<TextField
					label='Name'
					id={items.name.name}
					className='border-black'
					error={errors.name?.message}
					{...register('name')}
				/>
			</div>
			<div className='flex w-full gap-8'>
				<Controller
					control={control}
					name='measurement'
					render={({ field }) => (
						<LabeledControl label='Unit of Measurement' name={items.measurement.name}>
							<ErrorControl error={errors.measurement?.message}>
								<Select name={field.name} onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='border-black' id={items.measurement.name}>
										<SelectValue placeholder='Select measurement' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{measurementUnits.map((measurement) => (
												<SelectItem key={measurement} value={measurement}>
													{measurement[0].toUpperCase() + measurement.slice(1)}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</ErrorControl>
						</LabeledControl>
					)}
				/>
				<TextField
					label='Quantity'
					id={items.quantity.name}
					className='border-black'
					placeholder='0'
					error={errors.quantity?.message}
					{...register('quantity')}
				/>
			</div>
			<div className='flex w-full gap-8'>
				<TextField
					label='Warning threshold'
					id={items.warningThreshold.name}
					className='border-black'
					placeholder='0'
					error={errors.dangerThreshold?.message}
					{...register('warningThreshold')}
				/>
				<TextField
					label='Danger threshold'
					id={items.dangerThreshold.name}
					className='border-black'
					placeholder='0'
					error={errors.dangerThreshold?.message}
					{...register('dangerThreshold')}
				/>
			</div>
			<div className='w-full mt-4'>
				<SubmitButton className='w-full'>Add Item</SubmitButton>
			</div>
		</form>
	);
}
