import { useState, useCallback } from 'react';

export const useNotification = () => {
	const [notification, setNotification] = useState(null);

	const showNotification = useCallback((notificationData) => {
		const newNotification = {
			id: Date.now().toString(),
			timestamp: new Date(),
			read: false,
			...notificationData
		};
		setNotification(newNotification);

		// Auto-dismiss after 5 seconds for success notifications
		if (notificationData.type === 'success') {
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		}
	}, []);

	const dismissNotification = useCallback(() => {
		setNotification(null);
	}, []);

	return {
		notification,
		showNotification,
		dismissNotification
	};
};
