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
import { Spin } from 'antd';
import { useMenuData } from '../../../data/hooks/menu';

/**
 * Component that redirects to the first available menu page
 * Loads menu data and navigates to first menu's first page
 */
const AppsRedirect = () => {
    const navigate = useNavigate();
    const { mainMenus, isLoading } = useMenuData();

    useEffect(() => {
        // Once menus are loaded, redirect to first menu's first page
        if (!isLoading && mainMenus.length > 0) {
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
    }, [mainMenus, isLoading, navigate]);

    // Show loading spinner while fetching menus
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%'
        }}>
            <Spin size="large" tip="Loading menus..." />
        </div>
    );
};

export default AppsRedirect;
