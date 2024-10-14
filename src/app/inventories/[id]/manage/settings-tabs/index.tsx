'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$/components/ui/card';
import { InventorySettingsForm } from './inventory-settings-form';

interface SettingsTabProps {}

export function SettingsTab({}: SettingsTabProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Inventory Settings</CardTitle>
				<CardDescription>Manage your inventory settings and preferences</CardDescription>
			</CardHeader>
			<CardContent>
				<InventorySettingsForm />
			</CardContent>
		</Card>
	);
}
