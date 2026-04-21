import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { MainLayout } from '@zionix-space/design-system/layouts';
import { GlobalTopLoader } from '@zionix-space/design-system';
import { useMenuData } from '../../../../../data/hooks/menu';
import { QueryErrorFallback } from '../../../../common/QueryErrorBoundary';
import TopLoadingBar from '../../../../common/loaders/TopLoadingBar';
import { PageTransitionWrapper } from '@zionix/shared-utilities/animations';
import { useMemo, useState } from 'react';

/**
 * DesktopLayout Adapter Component - Infinite Level Support
 * Controls MainLayout using useMenuData hook - single source of truth for navigation
 * 
 * This adapter bridges the gap between:
 * - Frontend's useMenuData hook (flat selectedSidebarKey)
 * - Design System's MainLayout (hierarchical menu path array)
 */
const DesktopLayoutAdapter = ({ className = '', style = {} }) => {
    const { token, isDarkMode, toggleTheme } = useTheme();
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

    // Handle user menu clicks (profile, settings, logout)
    const handleUserMenuClick = (key) => {
        // Find the menu item from profileSection
        const menuItem = completeMenuData?.profileSection?.menuItems?.find(item => item.key === key);

        if (menuItem) {
            // Check if it's a logout action
            if (key === 'logout' || menuItem.action === 'logout') {
                // Clear authentication data
                localStorage.clear();
                sessionStorage.clear();
                // Redirect to home page
                window.location.href = '/';
                return;
            }

            // Navigate using route property from API
            if (menuItem.route) {
                navigate(menuItem.route);
            }
        } else {
            // Fallback for default items
            switch (key) {
                case 'profile':
                    navigate('/apps/profile');
                    break;
                case 'settings':
                    navigate('/apps/settings');
                    break;
                case 'logout':
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                    break;
                default:
                    console.log('Unknown menu action:', key);
            }
        }
    };

    // Search state management
    const [searchValue, setSearchValue] = useState('');
    const [selectedModule, setSelectedModule] = useState('all');
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchValue(value);
        // TODO: Implement live search API call here
        // For now, just clear results when empty
        if (!value.trim()) {
            setSearchResults([]);
        }
    };

    // Handle module filter change
    const handleModuleChange = (menuId) => {
        setSelectedModule(menuId);
        console.log('Selected module menu_id:', menuId);
    };

    // Handle search submit
    const handleSearch = (value) => {
        console.log('Search submitted:', value, 'Module:', selectedModule);
        // Add to history
        const historyItem = {
            text: value,
            module: selectedModule !== 'all' ? selectedModule : null,
            timestamp: new Date().toISOString()
        };
        setSearchHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
        // TODO: Implement search API call here
    };

    // Handle history item click
    const handleHistoryItemClick = (item) => {
        setSearchValue(item.text);
        if (item.module) {
            setSelectedModule(item.module);
        }
        handleSearch(item.text);
    };

    // Handle advanced search click
    const handleAdvancedSearchClick = () => {
        console.log('Advanced search clicked');
        // TODO: Navigate to advanced search page
    };

    // Show error fallback if menu loading failed
    if (isError) {
        return <QueryErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
    }

    // Show loading state
    if (isLoading || !completeMenuData) {
        return <GlobalTopLoader />;
    }

    // Transform menu data structure for modern layout
    const menuDataForLayout = {
        mainNavigation: completeMenuData.mainNavigation || [],
        profileSection: completeMenuData.profileSection || null,
        config: completeMenuData.config || {}
    };

    return (
        <MainLayout
            theme={{ token, isDarkMode, toggleTheme }}
            menuData={menuDataForLayout}
            loadingBar={<TopLoadingBar />}
            currentPath={location.pathname}
            PageTransitionWrapper={PageTransitionWrapper}
            className={className}
            style={style}
            // Controlled props - infinite level support
            selectedMenuPath={selectedMenuPath}
            onMenuSelect={handleMenuSelect}
            onUserMenuClick={handleUserMenuClick}
            // Search props
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            selectedModule={selectedModule}
            onModuleChange={handleModuleChange}
            onSearch={handleSearch}
            searchHistory={searchHistory}
            onHistoryItemClick={handleHistoryItemClick}
            onAdvancedSearchClick={handleAdvancedSearchClick}
            searchResults={searchResults}
        >
            <Outlet />
        </MainLayout>
    );
};

export default DesktopLayoutAdapter;
