'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '$/components/ui/tabs';
import { MembersTab } from './members-tab';
import { SettingsTab } from './settings-tabs';
import { StatsTab } from './stats-tab';

interface ManageContainerProps {}

const TabsType = {
	MEMBERS: 'members',
	SETTINGS: 'settings',
	STATS: 'stats',
};

export function ManageContainer({}: ManageContainerProps) {
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
			</TabsList>
			<TabsContent value={TabsType.MEMBERS}>
				<MembersTab />
			</TabsContent>
			<TabsContent value={TabsType.SETTINGS}>
				<SettingsTab />
			</TabsContent>
			<TabsContent value={TabsType.STATS}>
				<StatsTab />
			</TabsContent>
		</Tabs>
	);
}
