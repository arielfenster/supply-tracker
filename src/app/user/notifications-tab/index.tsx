'use client';

import { Input } from '$/components/form/input';
import { Label } from '$/components/form/label';
import { Button } from '$/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '$/components/ui/card';

interface NotificationsTabProps {}

export function NotificationsTab({}: NotificationsTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>Change your password here. After saving</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='space-y-1'>
					<Label htmlFor='current'>Current password</Label>
					<Input id='current' type='password' />
				</div>
				<div className='space-y-1'>
					<Label htmlFor='new'>New password</Label>
					<Input id='new' type='password' />
				</div>
			</CardContent>
			<CardFooter>
				<Button>Save password</Button>
			</CardFooter>
		</Card>
	);
}
