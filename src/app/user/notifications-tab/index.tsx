'use client';

import { useFormSubmission } from '$/app/_hooks/useFormSubmission';
import { ErrorControl } from '$/components/form/controls/error-control';
import { LabeledControl } from '$/components/form/controls/labeled-control';
import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
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
import { User, users, weekDays } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
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
	const { formRef, formMethods, setPending, toast } =
		useFormSubmission<UpdateUserNotificationsInput>(updateUserNotificationsSchema, {
			id: user.id,
			notificationsDay: user.notificationsDay ?? undefined,
			notificationsTime: user.notificationsTime ?? undefined,
		});

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = formMethods;

	async function handleFormSubmit() {
		const formData = new FormData(formRef.current!);
		await executeServerAction(updateUserNotificationsAction, setPending, {
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
		})(formData);
	}

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
								<LabeledControl label='Day'>
									<ErrorControl error={errors.notificationsDay?.message}>
										<Select name={field.name} onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder='Select a day' />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{weekDays.map((day) => (
														<SelectItem key={day} value={day}>
															{day[0].toUpperCase() + day.slice(1)}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</ErrorControl>
								</LabeledControl>
							)}
						/>
						<LabeledControl name={users.notificationsTime.name} label='Time'>
							<ErrorControl error={errors.notificationsTime?.message}>
								<Input
									type='time'
									defaultValue={user.notificationsTime ?? '00:00'}
									{...register('notificationsTime')}
								/>
							</ErrorControl>
						</LabeledControl>
					</section>
					<SubmitButton>Save</SubmitButton>
				</form>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}
