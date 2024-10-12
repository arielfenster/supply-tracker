'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { PasswordField } from '$/components/form/password-field';
import { SubmitButton } from '$/components/form/submit-button';
import { Button } from '$/components/ui/button';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import {
	AcceptInvitationInput,
	acceptInvitationSchema,
} from '$/schemas/invites/accept-invitation.schema';
import {
	DeclineInvitationInput,
	declineInvitationSchema,
} from '$/schemas/invites/decline-invitation.schema';
import { Check, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { acceptInvitationAction, declineInvitationAction } from './actions';

type FormState = {
	SHOW_INITIAL: 'SHOW_INITIAL';
	SHOW_ACCEPT: 'SHOW_ACCEPT';
	SHOW_DECLINE: 'SHOW_DECLINE';
};

export function InvitationResponseForm({
	invitationId,
	inventoryId,
}: {
	invitationId: string;
	inventoryId: string;
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
				<AcceptInvitationForm
					invitationId={invitationId}
					inventoryId={inventoryId}
					onCancel={() => setFormState('SHOW_INITIAL')}
				/>
			)}
			{formState === 'SHOW_DECLINE' && (
				<DeclineInvitationForm
					invitationId={invitationId}
					onCancel={() => setFormState('SHOW_INITIAL')}
				/>
			)}
		</div>
	);
}

function AcceptInvitationForm({
	invitationId,
	inventoryId,
	onCancel,
}: {
	invitationId: string;
	inventoryId: string;
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
	} = useFormSubmission<AcceptInvitationInput>({
		schema: acceptInvitationSchema,
		defaultValues: { invitationId },
		action: acceptInvitationAction,
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
			<input type='hidden' {...register('invitationId')} />
			<PasswordField
				label='Set your new password'
				{...register('password')}
				error={errors.password?.message}
			/>
			<SubmitButton>Accept Invitation</SubmitButton>
			<Button type='button' className='w-full' variant='ghost' onClick={onCancel}>
				Go back
			</Button>
		</form>
	);
}

function DeclineInvitationForm({
	invitationId,
	onCancel,
}: {
	invitationId: string;
	onCancel: () => void;
}) {
	const router = useRouter();
	const {
		formRef,
		formMethods: { register, handleSubmit },
		handleFormSubmit,
		toast,
	} = useFormSubmission<DeclineInvitationInput>({
		schema: declineInvitationSchema,
		defaultValues: { invitationId },
		action: declineInvitationAction,
		toasts: {
			success() {
				toast({
					title: '🖕 No need. Bye bye',
				});
				router.push(AppRoutes.AUTH.SIGNUP);
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
			<input type='hidden' {...register('invitationId')} />
			<span>Are you sure you want to decline this invitation?</span>
			<SubmitButton variant='destructive'>Confirm decline</SubmitButton>
			<Button className='w-full' variant='ghost' onClick={onCancel}>
				Go back
			</Button>
		</form>
	);
}
