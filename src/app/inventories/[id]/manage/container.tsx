'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '$/components/ui/tabs';
import { UserRole } from '$/db/schemas';
import { useManagePageContext } from './context';
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
	const { currentMember } = useManagePageContext();

	return (
		<Tabs defaultValue={TabsType.MEMBERS}>
			<TabsList className='gap-1 mb-4'>
				<TabsTrigger className='font-bold' value={TabsType.MEMBERS}>
					Members
				</TabsTrigger>
				{currentMember.role !== UserRole.VIEWER && (
					<TabsTrigger className='font-bold' value={TabsType.SETTINGS}>
						Settings
					</TabsTrigger>
				)}
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
