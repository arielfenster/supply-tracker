const KEY_PREFIX = 'st_';

export const LocalStorageKeys = {
	ACTIVE_INVENTORY_ID: 'active_inventory_id',
} as const;

export type LocalStorageKeys = (typeof LocalStorageKeys)[keyof typeof LocalStorageKeys];

export function useLocalStorage() {
	function getKey(name: LocalStorageKeys) {
		return localStorage.getItem(`${KEY_PREFIX}${name}`);
	}

	function setKey(name: LocalStorageKeys, value?: string) {
		if (value) {
			localStorage.setItem(`${KEY_PREFIX}${name}`, value);
		} else {
			localStorage.removeItem(`${KEY_PREFIX}${name}`);
		}
	}

	return {
		getKey,
		setKey,
	};
}
