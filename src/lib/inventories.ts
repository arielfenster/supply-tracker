import { UserRole } from '$/db/schemas';

export function isManageInventoryRole(role?: UserRole) {
	return role === UserRole.OWNER || role === UserRole.EDITOR;
}
