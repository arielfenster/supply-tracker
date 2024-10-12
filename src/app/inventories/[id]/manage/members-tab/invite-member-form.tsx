'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { LocalStorageKeys, useLocalStorage } from '$/app/_hooks/useLocalStorage';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { users } from '$/db/schemas';
import { InviteMemberInput, inviteMemberSchema } from '$/schemas/inventories/invite-member.schema';
import { PlusCircle } from 'lucide-react';
import { inviteMemberAction } from '../actions';

export function InviteMemberForm() {
	const { getKey } = useLocalStorage();
	const inventoryId = getKey(LocalStorageKeys.ACTIVE_INVENTORY_ID)!;

	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<InviteMemberInput>({
		schema: inviteMemberSchema,
		defaultValues: { inventoryId },
		action: inviteMemberAction,
		toasts: {
			success(result) {
				toast.success({ title: result.message });
			},
			error(result) {
				toast.error({
					title: 'Failed to send invitation',
					description: result.error,
				});
			},
		},
	});

	// FIXME: if there's an error for an invalid email, the submit button shifts down
	// and isn't aligned with the input field anymore
	return (
		<form
			className='flex items-center gap-4 w-1/2'
			onSubmit={handleSubmit(handleFormSubmit)}
			ref={formRef}
		>
			<input type='hidden' {...register('inventoryId')} />
			<TextField
				label='Email address'
				id={users.email.name}
				error={errors.email?.message}
				{...register('email')}
			/>
			<div className='mt-4'>
				<SubmitButton>
					<PlusCircle className='h-4 w-4' />
					Invite
				</SubmitButton>
			</div>
		</form>
	);
}
