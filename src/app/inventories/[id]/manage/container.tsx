'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '$/components/ui/tabs';
import { MembersTab } from './members-tab';
import { SettingsTab } from './settings-tabs';
import { StatsTab } from './stats-tab';

const TabsType = {
	MEMBERS: 'members',
	SETTINGS: 'settings',
	STATS: 'stats',
	LOGS: 'logs',
};

export function ManageContainer() {
	return (
		<Tabs defaultValue={TabsType.MEMBERS}>
			<TabsList className='gap-1 mb-4'>
				<TabsTrigger className='font-bold' value={TabsType.MEMBERS}>
					Members
				</TabsTrigger>
				<TabsTrigger className='font-bold' value={TabsType.SETTINGS}>
					Settings
				</TabsTrigger>
				<TabsTrigger className='font-bold' value={TabsType.STATS}>
					Stats
				</TabsTrigger>
				<TabsTrigger className='font-bold' value={TabsType.LOGS}>
					Logs
				</TabsTrigger>
			</TabsList>
			<TabsContent value={TabsType.MEMBERS}>
				<MembersTab />
			</TabsContent>
			<TabsContent value={TabsType.SETTINGS}>
				<SettingsTab />
			</TabsContent>
			<TabsContent value={TabsType.LOGS}>
				<StatsTab />
			</TabsContent>
		</Tabs>
	);
}
