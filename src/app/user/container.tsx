'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '$/components/ui/tabs';
import { User } from '$/db/schemas';
import { NotificationsTab } from './notifications-tab';
import { ProfileTab } from './profile-tab';

interface UserContainerProps {
	user: User;
}

const TabsType = {
	PROFILE: 'profile',
	NOTIFICATIONS: 'notifications',
};

export function UserContainer({ user }: UserContainerProps) {
	return (
		<Tabs defaultValue={TabsType.PROFILE} className='w-[400px] mx-auto mt-4'>
			<TabsList className='grid w-full grid-cols-2'>
				<TabsTrigger value={TabsType.PROFILE}>Profile</TabsTrigger>
				<TabsTrigger value={TabsType.NOTIFICATIONS}>Notifications</TabsTrigger>
			</TabsList>
			<TabsContent value={TabsType.PROFILE}>
				<ProfileTab user={user} />
			</TabsContent>
			<TabsContent value={TabsType.NOTIFICATIONS}>
				<NotificationsTab />
			</TabsContent>
		</Tabs>
	);
}
