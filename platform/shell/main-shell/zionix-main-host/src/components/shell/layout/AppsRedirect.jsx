/**
 * @fileoverview Apps Redirect Component
 * 
 * Handles automatic redirection to the first available menu page
 * when user navigates to /apps without a specific route.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuData } from '../../../data/hooks/menu';

/**
 * Component that redirects to the first available menu page
 * Loads menu data and navigates to first menu's first page
 * No loader shown - TopLoadingBar handles the visual feedback
 */
const AppsRedirect = () => {
    const navigate = useNavigate();
    const { mainMenus, isLoading, isError } = useMenuData();

    useEffect(() => {
        // Once menus are loaded, redirect to first menu's first page
        if (!isLoading && !isError && mainMenus.length > 0) {
            const firstMenu = mainMenus[0];

            // Navigate to first menu's first child page
            if (firstMenu.children && firstMenu.children.length > 0) {
                const firstPage = firstMenu.children[0];
                // Construct the route: /apps/{menuKey}/{pageKey}
                navigate(`/apps/${firstMenu.key}/${firstPage.key}`, { replace: true });
            } else {
                // If no children, just navigate to the menu key
                navigate(`/apps/${firstMenu.key}`, { replace: true });
            }
        }
    }, [mainMenus, isLoading, isError, navigate]);

    // Don't show anything - TopLoadingBar provides visual feedback
    return null;
};

export default AppsRedirect;
