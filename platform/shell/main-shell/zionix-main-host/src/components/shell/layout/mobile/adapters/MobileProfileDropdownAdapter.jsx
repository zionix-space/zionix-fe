import { useNavigate } from 'react-router-dom';
import { MobileProfileDropdown } from '@zionix-space/design-system/layouts';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';

/**
 * MobileProfileDropdownAdapter - Adapter component that handles business logic for MobileProfileDropdown
 * Connects application state and hooks to the presentational MobileProfileDropdown component
 */
const MobileProfileDropdownAdapter = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user, clearAuth } = useAuthStore();

    // Handle navigation
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            // Clear auth store (this also clears localStorage)
            clearAuth();

            // Dispatch logout event for all microfrontends
            window.dispatchEvent(new CustomEvent('auth:logout'));

            // Navigate to root path
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Ensure navigation happens even if there's an error
            navigate('/');
        }
    };

    // Prepare user data
    const userData = {
        name: user?.name || user?.username || 'User',
        email: user?.email || 'user@example.com',
        avatar: user?.avatar || user?.profilePicture || null,
    };

    // Define menu items
    const menuItems = [
        {
            key: 'profile',
            label: 'Profile',
            icon: 'ri-user-line',
            path: '/apps/profile',
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: 'ri-settings-line',
            path: '/apps/settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: 'ri-logout-box-line',
        },
    ];

    return (
        <MobileProfileDropdown
            isOpen={isOpen}
            onClose={onClose}
            userData={userData}
            menuItems={menuItems}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
        />
    );
};

export default MobileProfileDropdownAdapter;
