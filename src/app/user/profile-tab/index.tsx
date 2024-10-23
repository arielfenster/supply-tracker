'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { Card, CardContent, CardHeader, CardTitle } from '$/components/ui/card';
import { User } from '$/db/schemas';
import {
	UpdateUserProfileInput,
	updateUserProfileSchema,
} from '$/schemas/user/update-user-profile.schema';
import { updateUserProfileAction } from '../actions';

interface ProfileTabProps {
	user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
	const {
		formRef,
		formMethods: {
			handleSubmit,
			register,
			formState: { errors },
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<UpdateUserProfileInput>({
		schema: updateUserProfileSchema,
		defaultValues: {
			id: user.id,
			firstName: user.firstName ?? undefined,
			lastName: user.lastName ?? undefined,
			email: user.email,
		},
		action: updateUserProfileAction,
		toasts: {
			success(result) {
				toast.success({
					title: result.message,
				});
			},
			error(result) {
				toast.error({
					title: 'Failed to update user',
					description: result.error,
				});
			},
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					className='flex flex-col gap-2'
					onSubmit={handleSubmit(handleFormSubmit)}
					ref={formRef}
				>
					<section>
						<h3 className='text-lg'>Personal Information</h3>
						<input type='hidden' {...register('id')} />
						<TextField
							label='First name'
							{...register('firstName')}
							error={errors.firstName?.message}
						/>
						<TextField
							label='Last name'
							{...register('lastName')}
							error={errors.lastName?.message}
						/>
						<TextField label='Email' {...register('email')} error={errors.email?.message} />
					</section>
					<section>
						<h3 className='text-lg'>Change Password</h3>
						<PasswordField
							label='Current password'
							{...register('currentPassword')}
							error={errors.currentPassword?.message}
							required={false}
						/>
						<PasswordField
							label='New password'
							{...register('newPassword')}
							error={errors.newPassword?.message}
							required={false}
						/>
					</section>
					<SubmitButton>Save changes</SubmitButton>
				</form>
			</CardContent>
		</Card>
	);
}
