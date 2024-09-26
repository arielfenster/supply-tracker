'use client';

import { Input } from '$/components/form/input';
import { SubmitButton } from '$/components/form/submit-button';
import { useToast } from '$/components/hooks/use-toast';
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
import { User } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { updateUserNotificationsAction } from '../actions';

interface NotificationsTabProps {
	user: User;
}

export function NotificationsTab({ user }: NotificationsTabProps) {
	const { toast } = useToast();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Low stock alerts</CardTitle>
				<CardDescription>
					Choose day and time to receive notification regarding low-quantity items
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<form
					action={executeServerAction(updateUserNotificationsAction, {
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
					})}
				>
					<input hidden name='id' className='hidden' defaultValue={user.id} />
					<section className='flex space-x-4 mb-4'>
						<Select name='day'>
							<SelectTrigger className='flex-1'>
								<SelectValue placeholder='Select a day' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{/* TODO: use the const weekDays */}
									<SelectItem value='sunday'>Sunday</SelectItem>
									<SelectItem value='monday'>Monday</SelectItem>
									<SelectItem value='tuesday'>Tuesday</SelectItem>
									<SelectItem value='wednesday'>Wednesday</SelectItem>
									<SelectItem value='thursday'>Thursday</SelectItem>
									<SelectItem value='friday'>Friday</SelectItem>
									<SelectItem value='saturday'>Saturday</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<Input className='flex-1' type='time' name='time' defaultValue='00:00' />
					</section>
					<SubmitButton>Save</SubmitButton>
				</form>
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}
