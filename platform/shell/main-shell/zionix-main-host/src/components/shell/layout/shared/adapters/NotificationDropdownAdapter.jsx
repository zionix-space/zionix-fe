import { useTheme } from '@zionix-space/design-system';
import { NotificationDropdown } from '@zionix-space/design-system/layouts';
import { useCallback } from 'react';

/**
 * NotificationDropdown Adapter Component
 * Handles business logic for notifications
 */
const NotificationDropdownAdapter = ({ onNotificationClick, buttonStyle, ...props }) => {
    const { token } = useTheme();

    // Handle notification click - memoized to prevent re-renders
    const handleNotificationClick = useCallback((notificationId, actionType) => {
        console.log(`Notification action: ${actionType} for notification ${notificationId}`);
        if (onNotificationClick) {
            onNotificationClick(notificationId, actionType);
        }
    }, [onNotificationClick]);

    return (
        <NotificationDropdown
            theme={{ token }}
            onNotificationClick={handleNotificationClick}
            buttonStyle={buttonStyle}
            {...props}
        />
    );
};

export default NotificationDropdownAdapter;
