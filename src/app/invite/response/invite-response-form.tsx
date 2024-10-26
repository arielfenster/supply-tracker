'use client';

import { useFormSubmission } from '$/hooks/useFormSubmission';
import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { Button } from '$/components/ui/button';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { AcceptInviteInput, acceptInviteSchema } from '$/schemas/invites/accept-invite.schema';
import { DeclineInviteInput, declineInviteSchema } from '$/schemas/invites/decline-invite.schema';
import { Check, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { acceptInviteAction, declineInviteAction } from './actions';

type FormState = {
	SHOW_INITIAL: 'SHOW_INITIAL';
	SHOW_ACCEPT: 'SHOW_ACCEPT';
	SHOW_DECLINE: 'SHOW_DECLINE';
};

export function InviteResponseForm({
	inviteId,
	inventoryId,
	isNewUser,
}: {
	inviteId: string;
	inventoryId: string;
	isNewUser: boolean;
}) {
	const [formState, setFormState] = useState<keyof FormState>('SHOW_INITIAL');

	return (
		<div>
			{formState === 'SHOW_INITIAL' && (
				<div className='flex justify-center gap-3'>
					<Button onClick={() => setFormState('SHOW_ACCEPT')}>
						<Check />
						Accept
					</Button>
					<Button variant='secondary' onClick={() => setFormState('SHOW_DECLINE')}>
						<XIcon />
						Decline
					</Button>
				</div>
			)}
			{formState === 'SHOW_ACCEPT' && (
				<AcceptInviteForm
					inviteId={inviteId}
					inventoryId={inventoryId}
					isNewUser={isNewUser}
					onCancel={() => setFormState('SHOW_INITIAL')}
				/>
			)}
			{formState === 'SHOW_DECLINE' && (
				<DeclineInviteForm inviteId={inviteId} onCancel={() => setFormState('SHOW_INITIAL')} />
			)}
		</div>
	);
}

function AcceptInviteForm({
	inviteId,
	inventoryId,
	isNewUser,
	onCancel,
}: {
	inviteId: string;
	inventoryId: string;
	isNewUser: boolean;
	onCancel: () => void;
}) {
	const router = useRouter();

	const {
		formRef,
		formMethods: {
			register,
			handleSubmit,
			formState: { errors },
		},
		handleFormSubmit,
		toast,
	} = useFormSubmission<AcceptInviteInput>({
		schema: acceptInviteSchema,
		defaultValues: { inviteId },
		action: acceptInviteAction,
		toasts: {
			success() {
				toast.success({
					title: "Glad you joined! You'll be redirected to the inventory shortly",
				});
				router.push(replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [inventoryId]));
			},
			error(result) {
				toast.error({
					title: 'Failed to accept invitation',
					description: result.error,
				});
			},
		},
	});

	return (
		<form className='flex flex-col gap-4' ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
			<input type='hidden' {...register('inviteId')} />
			{isNewUser && (
				<PasswordField
					label='Set Your Password'
					{...register('password')}
					error={errors.password?.message}
				/>
			)}
			<SubmitButton>Accept Invitation</SubmitButton>
			<Button type='button' className='w-full' variant='ghost' onClick={onCancel}>
				Go back
			</Button>
		</form>
	);
}

function DeclineInviteForm({ inviteId, onCancel }: { inviteId: string; onCancel: () => void }) {
	const router = useRouter();
	const {
		formRef,
		formMethods: { register, handleSubmit },
		handleFormSubmit,
		toast,
	} = useFormSubmission<DeclineInviteInput>({
		schema: declineInviteSchema,
		defaultValues: { inviteId },
		action: declineInviteAction,
		toasts: {
			success() {
				toast({
					title: '🖕 No need. Bye bye',
				});
				router.push(AppRoutes.PAGES.DASHBOARD);
			},
			error(result) {
				toast.error({
					title: 'Failed to decline invitation',
					description: result.error,
				});
			},
		},
	});

	return (
		<form
			className='flex flex-col items-center gap-4'
			ref={formRef}
			onSubmit={handleSubmit(handleFormSubmit)}
		>
			<input type='hidden' {...register('inviteId')} />
			<span>Are you sure you want to decline this invitation?</span>
			<SubmitButton variant='destructive'>Confirm decline</SubmitButton>
			<Button className='w-full' variant='ghost' onClick={onCancel}>
				Go back
			</Button>
		</form>
	);
}
