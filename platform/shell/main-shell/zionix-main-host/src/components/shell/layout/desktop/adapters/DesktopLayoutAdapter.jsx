import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { MainLayout } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../../common/QueryErrorBoundary';
import TopLoadingBar from '../../../../common/loaders/TopLoadingBar';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import { useMemo } from 'react';

/**
 * DesktopLayout Adapter Component - Infinite Level Support
 * Controls MainLayout using useMenuData hook - single source of truth for navigation
 * 
 * This adapter bridges the gap between:
 * - Frontend's useMenuData hook (flat selectedSidebarKey)
 * - Design System's MainLayout (hierarchical menu path array)
 */
const DesktopLayoutAdapter = ({ className = '', style = {} }) => {
    const { token, isDarkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Get menu data and navigation state from useMenuData hook
    const {
        completeMenuData,
        selectedMainMenuKey,
        selectedSidebarKey,
        selectMainMenu,
        selectSidebarMenu,
        getMenuRoute,
        findMenuByKey,
        getParentKeys,
        isLoading,
        isError,
        error
    } = useMenuData();

    // Build full menu path array from selectedMainMenuKey and selectedSidebarKey
    // This supports infinite depth: [level1, level2, level3, level4, level5, ...]
    // MUST be called before any conditional returns to avoid hook order issues
    const selectedMenuPath = useMemo(() => {
        if (!selectedMainMenuKey) return [];

        // Start with Level 1 (main app)
        const path = [selectedMainMenuKey];

        // If no sidebar selection, return just Level 1
        if (!selectedSidebarKey) return path;

        // Get the selected menu item
        const selectedMenu = findMenuByKey(selectedSidebarKey);
        if (!selectedMenu) return path;

        // Get all parent keys (these are the intermediate levels)
        const parentKeys = getParentKeys(selectedSidebarKey) || [];

        // Build full path: [level1, ...parentKeys, selectedKey]
        // parentKeys already contains Level 2, 3, 4, etc. up to the parent of selectedKey
        path.push(...parentKeys);

        // Add the selected key itself at the end
        path.push(selectedSidebarKey);

        return path;
    }, [selectedMainMenuKey, selectedSidebarKey, findMenuByKey, getParentKeys]);

    // Handle menu selection - works for any level
    // MUST be called before any conditional returns to avoid hook order issues
    const handleMenuSelect = (key) => {
        // For Level 1 (main app), use selectMainMenu
        const selectedMenu = findMenuByKey(key);
        if (selectedMenu && selectedMenu.level === 1) {
            selectMainMenu(key);
            return;
        }

        // For all other levels, use selectSidebarMenu and navigate
        selectSidebarMenu(key);
        const route = getMenuRoute(key);
        if (route) {
            navigate(route);
        }
    };

    // Show error fallback if menu loading failed
    if (isError) {
        return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
    }

    // Show loading state
    if (isLoading || !completeMenuData) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <TopLoadingBar />
                Loading...
            </div>
        );
    }

    // Transform menu data structure for modern layout
    const menuDataForLayout = {
        mainNavigation: completeMenuData.mainNavigation || [],
        profileSection: completeMenuData.profileSection || null,
        config: completeMenuData.config || {}
    };

    return (
        <MainLayout
            theme={{ token, isDarkMode }}
            menuData={menuDataForLayout}
            loadingBar={<TopLoadingBar />}
            currentPath={location.pathname}
            PageTransitionWrapper={PageTransitionWrapper}
            className={className}
            style={style}
            // Controlled props - infinite level support
            selectedMenuPath={selectedMenuPath}
            onMenuSelect={handleMenuSelect}
        >
            <Outlet />
        </MainLayout>
    );
};

export default DesktopLayoutAdapter;
