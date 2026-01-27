import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { MobileHeader } from '@zionix-space/design-system/layouts';
import { useResponsiveLayout } from '../../shared/ResponsiveLayoutProvider';
import { useMenuData } from '../../../../../data/hooks/menu';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';

/**
 * MobileHeader Adapter Component
 * Handles business logic and data fetching for MobileHeader
 */
const MobileHeaderAdapter = () => {
    const { token, isDarkMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
    const { deviceType } = useResponsiveLayout();
    const { profileSection } = useMenuData();
    const navigate = useNavigate();
    const { clearAuth } = useAuthStore();

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

    const profileData = {
        ...(profileSection || {}),
        userData: profileSection?.userData || { name: "User", email: "user@example.com" },
        menuItems: profileSection?.menuItems || [],
        onNavigate: handleNavigate,
        onLogout: handleLogout,
    };

    return (
        <MobileHeader
            theme={{
                token,
                isDarkMode,
                toggleTheme,
                primaryColor,
                setPrimaryColor,
            }}
            deviceType={deviceType}
            profile={profileData}
        />
    );
};

export default MobileHeaderAdapter;
