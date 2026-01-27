import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { DesktopTopBar } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';
import NotificationDropdown from '../../shared/adapters/NotificationDropdownAdapter';

/**
 * DesktopTopBar Adapter Component
 * Handles business logic and data fetching for DesktopTopBar
 */
const DesktopTopBarAdapter = () => {
    const { token, isDarkMode } = useTheme();
    const navigate = useNavigate();
    const { mainMenus, selectedMainMenu, isLoading: isMenuLoading, selectMainMenu } = useMenuData();
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Get current fullscreen element
    const getFullscreenElement = () => {
        return (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null
        );
    };

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = getFullscreenElement();
            setIsFullscreen(!!fullscreenElement);
        };

        const events = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange',
            'msfullscreenchange',
        ];

        events.forEach((event) => {
            document.addEventListener(event, handleFullscreenChange, false);
        });

        handleFullscreenChange();

        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, handleFullscreenChange, false);
            });
        };
    }, []);

    // Enter fullscreen
    const enterFullscreen = async () => {
        try {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            return true;
        } catch (error) {
            console.warn('Failed to enter fullscreen:', error.message);
            return false;
        }
    };

    // Exit fullscreen
    const exitFullscreen = async () => {
        if (!getFullscreenElement()) return true;
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
            return true;
        } catch (error) {
            console.warn('Failed to exit fullscreen:', error.message);
            return false;
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = useCallback(async () => {
        if (isFullscreen) {
            await exitFullscreen();
        } else {
            await enterFullscreen();
        }
    }, [isFullscreen]);

    // Handle main menu selection - memoized
    const handleMainMenuSelect = useCallback(({ key }) => {
        selectMainMenu(key);

        const selectedMenu = mainMenus.find(menu => menu.key === key);
        if (selectedMenu) {
            if (selectedMenu.children && selectedMenu.children.length > 0) {
                const firstChild = selectedMenu.children[0];
                if (firstChild.children && firstChild.children.length > 0) {
                    const firstNestedChild = firstChild.children[0];
                    if (firstNestedChild.route) {
                        const route = firstNestedChild.route.startsWith('/')
                            ? firstNestedChild.route
                            : `/${firstNestedChild.route}`;
                        navigate(route);
                    }
                } else if (firstChild.route) {
                    const route = firstChild.route.startsWith('/')
                        ? firstChild.route
                        : `/${firstChild.route}`;
                    navigate(route);
                }
            } else if (selectedMenu.route) {
                const route = selectedMenu.route.startsWith('/')
                    ? selectedMenu.route
                    : `/${selectedMenu.route}`;
                navigate(route);
            }
        }
    }, [mainMenus, navigate, selectMainMenu]);

    // Transform menu data - memoized
    const navigationItems = useMemo(() =>
        mainMenus
            .filter((menu) => menu.key !== 'admin-app')
            .map((menu) => ({
                key: menu.key,
                label: menu.label,
                icon: menu.icon ? <i className={menu.icon} /> : null,
            }))
        , [mainMenus]);

    const adminMenu = useMemo(() =>
        mainMenus.find((menu) => menu.key === 'admin-app')
        , [mainMenus]);

    // Notification handler - memoized
    const handleNotificationClick = useCallback((notificationId, actionType) => {
        console.log(`Notification action: ${actionType} for notification ${notificationId}`);
    }, []);

    // Memoize notification dropdown to prevent re-renders
    const notificationDropdown = useMemo(() => (
        <NotificationDropdown
            onNotificationClick={handleNotificationClick}
            buttonStyle={{}}
        />
    ), [handleNotificationClick]);

    return (
        <DesktopTopBar
            theme={{ token, isDarkMode }}
            menu={{
                navigationItems,
                selectedMainMenu,
                isLoading: isMenuLoading,
                onSelect: handleMainMenuSelect,
                adminMenu,
            }}
            fullscreen={{
                isFullscreen,
                onToggle: toggleFullscreen,
            }}
            notificationDropdown={notificationDropdown}
        />
    );
};

export default DesktopTopBarAdapter;
