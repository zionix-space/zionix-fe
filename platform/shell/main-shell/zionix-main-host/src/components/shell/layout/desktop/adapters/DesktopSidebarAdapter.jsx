import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { DesktopSidebar } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';
import { useCallback, useMemo } from 'react';

/**
 * DesktopSidebar Adapter Component
 * Handles business logic and data fetching for DesktopSidebar
 */
const DesktopSidebarAdapter = ({ collapsed, onCollapse }) => {
    const { token, isDarkMode, toggleTheme, toggleRTL, isRTL, primaryColor, setPrimaryColor } = useTheme();
    const navigate = useNavigate();
    const { clearAuth } = useAuthStore();

    const {
        sidebarMenus,
        selectedMainMenu,
        selectedSidebarKey,
        selectSidebarMenu,
        openSidebarKeys,
        setOpenSidebarKeys,
        profileSection,
        getMenuRoute,
        isLoading: isMenuLoading,
        isError: isMenuError,
    } = useMenuData();

    // Handle menu selection - memoized to prevent re-renders
    const handleMenuSelect = useCallback(async (key) => {
        selectSidebarMenu(key);

        if (key === 'logout') {
            try {
                clearAuth();
                window.dispatchEvent(new CustomEvent('auth:logout'));
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
                navigate('/');
            }
            return;
        }

        if (key === 'profile') {
            navigate('/apps/profile');
            return;
        }

        const route = getMenuRoute(key);
        if (route) {
            navigate(route);
        }
    }, [selectSidebarMenu, clearAuth, navigate, getMenuRoute]);

    // Handle open keys change - memoized
    const handleOpenChange = useCallback((keys) => {
        setOpenSidebarKeys(keys);
    }, [setOpenSidebarKeys]);

    // Memoize theme object to prevent re-renders
    const themeConfig = useMemo(() => ({
        token,
        isDarkMode,
        toggleTheme,
        toggleRTL,
        isRTL,
        primaryColor,
        setPrimaryColor,
    }), [token, isDarkMode, toggleTheme, toggleRTL, isRTL, primaryColor, setPrimaryColor]);

    // Memoize menu object to prevent re-renders
    const menuConfig = useMemo(() => ({
        sidebarMenus,
        selectedMainMenu,
        selectedSidebarKey,
        openKeys: openSidebarKeys,
        profileSection,
        isLoading: isMenuLoading,
        isError: isMenuError,
        onSelect: handleMenuSelect,
        onOpenChange: handleOpenChange,
    }), [sidebarMenus, selectedMainMenu, selectedSidebarKey, openSidebarKeys, profileSection, isMenuLoading, isMenuError, handleMenuSelect, handleOpenChange]);

    return (
        <DesktopSidebar
            collapsed={collapsed}
            onCollapse={onCollapse}
            theme={themeConfig}
            menu={menuConfig}
        />
    );
};

export default DesktopSidebarAdapter;
