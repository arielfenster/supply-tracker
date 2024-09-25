'use client';

import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import { useToast } from '$/components/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '$/components/ui/card';
import { User } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { updateUserProfileAction } from '../actions';

interface ProfileTabProps {
	user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
	const { toast } = useToast();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				<form
					action={executeServerAction(updateUserProfileAction, {
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
					})}
				>
					<section>
						<h3 className='text-lg'>Personal Information</h3>
						<input hidden className='hidden' name='id' defaultValue={user.id} />
						<TextField label='First name' name='firstName' defaultValue={user.firstName || ''} />
						<TextField label='Last name' name='lastName' defaultValue={user.lastName || ''} />
						<TextField label='Email' name='email' defaultValue={user.email} />
					</section>
					<section>
						<h3 className='text-lg'>Change Password</h3>
						<PasswordField label='Current password' name='currentPassword' required={false} />
						<PasswordField label='New password' name='newPassword' required={false} />
					</section>

					<SubmitButton>Save changes</SubmitButton>
				</form>
			</CardContent>
		</Card>
	);
}
