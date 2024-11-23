import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useMediaQuery() {
	const [device, setDevice] = useState<DeviceType | null>(null);

	useEffect(() => {
		function checkDevice() {
			if (window.matchMedia('(max-width: 767px)').matches) {
				setDevice('mobile');
			} else if (window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) {
				setDevice('tablet');
			} else {
				setDevice('desktop');
			}
		}

		// initial check
		checkDevice();

		window.addEventListener('resize', checkDevice);
		return () => {
			window.removeEventListener('resize', checkDevice);
		};
	}, []);

	return {
		device,
		isMobile: device === 'mobile',
		isTablet: device === 'tablet',
		isDesktop: device === 'desktop',
	};
}
