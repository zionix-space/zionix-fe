/**
 * @fileoverview Apps Redirect Component
 * 
 * Handles automatic redirection to the first available menu page
 * when user navigates to /apps without a specific route.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuData } from '../../../data/hooks/menu';

/**
 * Component that redirects to the first available menu page
 * Loads menu data and navigates to first menu's first page
 * No loader shown - TopLoadingBar handles the visual feedback
 */
const AppsRedirect = () => {
    const navigate = useNavigate();
    const {
        mainMenus,
        selectedMainMenu,
        sidebarMenus,
        selectedSidebarKey,
        isLoading,
        isError,
        getMenuRoute
    } = useMenuData();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        // Prevent multiple redirects
        if (hasRedirected) return;

        // Wait for menus to load
        if (isLoading || isError || mainMenus.length === 0) return;

        // Wait for selectedMainMenu to be set by useMenuData
        if (!selectedMainMenu) return;

        // Wait for sidebar menus to be available
        if (!sidebarMenus || sidebarMenus.length === 0) {
            // If no sidebar menus, navigate to the main menu route
            const mainMenuRoute = selectedMainMenu.route || selectedMainMenu.key;
            const targetRoute = `/apps/${mainMenuRoute}`;
            navigate(targetRoute, { replace: true });
            setHasRedirected(true);
            return;
        }

        // CRITICAL: Wait for sidebar key to be auto-selected by useMenuData
        // This ensures the first menu item is selected before navigation
        if (!selectedSidebarKey) return;

        // Now we have everything: main menu, sidebar menus, and selected sidebar key
        // Build the route using getMenuRoute
        const route = getMenuRoute(selectedSidebarKey);

        if (route) {
            navigate(route, { replace: true });
            setHasRedirected(true);
        } else {
            // Fallback: try to construct route manually
            const mainMenuRoute = selectedMainMenu.route || selectedMainMenu.key;
            const fallbackRoute = `/apps/${mainMenuRoute}`;
            navigate(fallbackRoute, { replace: true });
            setHasRedirected(true);
        }
    }, [
        mainMenus,
        selectedMainMenu,
        sidebarMenus,
        selectedSidebarKey,
        isLoading,
        isError,
        navigate,
        getMenuRoute,
        hasRedirected
    ]);

    // Don't show anything - TopLoadingBar provides visual feedback
    return null;
};

export default AppsRedirect;
