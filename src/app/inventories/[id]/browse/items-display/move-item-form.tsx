'use client';

import { FieldControl } from '$/components/form/controls/field-control';
import { LabelControl } from '$/components/form/controls/label-control';
import { SubmitButton } from '$/components/form/submit-button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { items, subcategories } from '$/db/schemas';
import { useFormSubmission } from '$/hooks/useFormSubmission';
import { QueryParams, useQueryParams } from '$/hooks/useQueryParams';
import { getCategoryFromName, getSubcategoryFromName } from '$/lib/inventories';
import { MoveItemInput, moveItemSchema } from '$/schemas/items/move-item.schema';
import { Controller } from 'react-hook-form';
import { moveItemAction } from './actions';

interface MoveItemFormProps {
	itemId: string;
	inventory: UserInventory;
	onSuccess?: () => void;
}

export function MoveItemForm({ itemId, inventory, onSuccess }: MoveItemFormProps) {
	const { getQueryParam } = useQueryParams();
	const category = getCategoryFromName(inventory, getQueryParam(QueryParams.CATEGORY)!)!;
	const subcategory = getSubcategoryFromName(category, getQueryParam(QueryParams.SUBCATEGORY)!)!;

	const {
		formRef,
		formMethods: { register, handleSubmit, control, watch },
		toast,
		handleFormSubmit,
	} = useFormSubmission<MoveItemInput>({
		schema: moveItemSchema,
		action: moveItemAction,
		defaultValues: {
			itemId,
			categoryId: category.id,
			subcategoryId: subcategory.id,
		},
		toasts: {
			success() {
				toast.success({ title: 'Item moved' });
				onSuccess?.();
			},
			error(result) {
				toast.error({ title: 'Failed to move item', description: result.error });
			},
		},
	});

	const categories = inventory.categories;
	const subcategoriesOfCategory = categories.find(
		(category) => category.id === watch('categoryId'),
	)!.subcategories;

	return (
		<form className='flex flex-col gap-2' onSubmit={handleSubmit(handleFormSubmit)} ref={formRef}>
			<input type='hidden' {...register('itemId')} />
			<Controller
				control={control}
				name='categoryId'
				render={({ field }) => (
					<FieldControl>
						<LabelControl label='Category' name={subcategories.categoryId.name}>
							<Select name={field.name} onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className='border-black' id={subcategories.categoryId.name}>
									<SelectValue placeholder='Select a category' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</LabelControl>
					</FieldControl>
				)}
			/>
			<Controller
				control={control}
				name='subcategoryId'
				render={({ field }) => (
					<FieldControl>
						<LabelControl label='Subcategory' name={items.subcategoryId.name}>
							<Select name={field.name} onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className='border-black' id={items.subcategoryId.name}>
									<SelectValue placeholder='Select a subcategory' />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{subcategoriesOfCategory.map((subcategory) => (
											<SelectItem key={subcategory.id} value={subcategory.id}>
												{subcategory.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</LabelControl>
					</FieldControl>
				)}
			/>
			<SubmitButton className='self-end'>Move Item</SubmitButton>
		</form>
	);
}
