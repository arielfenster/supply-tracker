'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { ErrorControl } from '$/components/form/controls/error-control';
import { FieldControl } from '$/components/form/controls/field-control';
import { LabelControl } from '$/components/form/controls/label-control';
import { SubmitButton } from '$/components/form/submit-button';
import { TextField } from '$/components/form/textfield';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '$/components/ui/card';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '$/components/ui/select';
import { User, weekDays } from '$/db/schemas';
import {
	UpdateUserNotificationsInput,
	updateUserNotificationsSchema,
} from '$/schemas/user/update-user-notifications.schema';
import { Controller } from 'react-hook-form';
import { updateUserNotificationsAction } from '../actions';

interface NotificationsTabProps {
	user: User;
}

export function NotificationsTab({ user }: NotificationsTabProps) {
	const {
		formRef,
		formMethods: {
			handleSubmit,
			register,
			formState: { errors },
			control,
		},
		toast,
		handleFormSubmit,
	} = useFormSubmission<UpdateUserNotificationsInput>({
		schema: updateUserNotificationsSchema,
		defaultValues: {
			id: user.id,
			notificationsDay: user.notificationsDay ?? undefined,
			notificationsTime: user.notificationsTime ?? undefined,
		},
		action: updateUserNotificationsAction,
		toasts: {
			success(result) {
				toast.success({
					title: result.message,
				});
			},
			error(result) {
				toast.error({
					title: 'Failed to update notifications',
					description: result.error,
				});
			},
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Low stock alerts</CardTitle>
				<CardDescription>
					Choose day and time to receive notification regarding low-quantity items
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<form onSubmit={handleSubmit(handleFormSubmit)} ref={formRef}>
					<input type='hidden' {...register('id')} />
					<section className='flex space-x-4 mb-4'>
						<Controller
							control={control}
							name='notificationsDay'
							render={({ field }) => (
								<FieldControl>
									<LabelControl label='Day' name={field.name}>
										<ErrorControl error={errors.notificationsDay?.message}>
											<Select name={field.name} onValueChange={field.onChange} value={field.value}>
												<SelectTrigger>
													<SelectValue placeholder='Select a day' />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{weekDays.map((day) => (
															<SelectItem key={day} value={day}>
																{day}
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
							label='Time'
							type='time'
							error={errors.notificationsTime?.message}
							{...register('notificationsTime')}
						/>
					</section>
					<SubmitButton>Save</SubmitButton>
				</form>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}
