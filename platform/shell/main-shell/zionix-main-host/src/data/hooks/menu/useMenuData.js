/**
 * @fileoverview Menu Data Management Hook
 * 
 * Custom hook that combines React Query for data fetching with Zustand for UI state.
 * Provides a clean API for components to access menu data and manage selection state.
 * Handles page refresh, selection persistence, and dynamic menu expansion.
 * 
 * @author Zionix Platform Team
 * @version 2.0.0
 */

import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMenuQuery } from './useMenuQuery';
import { useMenuStore } from '../../stores/menu/useMenuStore';

/**
 * Recursively find a menu item by key in nested structure
 * @param {Array} menus - Menu items array
 * @param {string} key - Menu key to find
 * @returns {Object|null} Found menu item or null
 */
const findMenuByKey = (menus, key) => {
    if (!menus || !Array.isArray(menus)) return null;

    for (const menu of menus) {
        if (menu.key === key) return menu;
        if (menu.children && menu.children.length > 0) {
            const found = findMenuByKey(menu.children, key);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Get all parent keys for a given menu key (for auto-expansion)
 * @param {Array} menus - Menu items array
 * @param {string} targetKey - Target menu key
 * @param {Array} parentKeys - Accumulated parent keys
 * @returns {Array|null} Array of parent keys or null
 */
const getParentKeys = (menus, targetKey, parentKeys = []) => {
    if (!menus || !Array.isArray(menus)) return null;

    for (const menu of menus) {
        if (menu.key === targetKey) {
            return parentKeys;
        }
        if (menu.children && menu.children.length > 0) {
            const found = getParentKeys(menu.children, targetKey, [...parentKeys, menu.key]);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Build full route path for a menu item by traversing the hierarchy
 * Uses the 'route' property from API response (the actual slug)
 * Falls back to 'key' only when route is null/empty
 * @param {Array} menus - Menu items array
 * @param {string} targetKey - Target menu key
 * @param {string} baseRoute - Base route from parent (e.g., "/apps/admin-app")
 * @param {Array} pathParts - Accumulated path parts
 * @returns {string|null} Full route path or null
 */
const buildMenuRoute = (menus, targetKey, baseRoute = '', pathParts = []) => {
    if (!menus || !Array.isArray(menus)) return null;

    for (const menu of menus) {
        if (menu.key === targetKey) {
            // Found the target - build the route
            const allParts = [];

            // Add base route if it exists
            if (baseRoute && baseRoute.trim() !== '') {
                allParts.push(baseRoute);
            }

            // Add accumulated path parts
            allParts.push(...pathParts);

            // Add current menu's route (preferred) or key (fallback)
            const menuSlug = (menu.route && menu.route !== null && menu.route.trim() !== '')
                ? menu.route
                : menu.key;
            allParts.push(menuSlug);

            // Join parts, clean up, and ensure it starts with /
            const fullRoute = '/' + allParts
                .filter(p => p && p.trim() !== '')
                .map(p => String(p).replace(/^\/+|\/+$/g, '')) // Remove leading/trailing slashes from each part
                .join('/')
                .replace(/\/+/g, '/'); // Remove duplicate slashes

            return fullRoute;
        }

        if (menu.children && menu.children.length > 0) {
            // Add current menu's route (preferred) or key (fallback) to path
            const menuSlug = (menu.route && menu.route !== null && menu.route.trim() !== '')
                ? menu.route
                : menu.key;
            const currentParts = [...pathParts, menuSlug];

            const found = buildMenuRoute(menu.children, targetKey, baseRoute, currentParts);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Hook to manage menu data and UI state
 * Combines React Query (data) with Zustand (UI state)
 * 
 * @returns {Object} Menu data and state management functions
 * 
 * @example
 * ```js
 * const {
 *   mainMenus,
 *   selectedMainMenu,
 *   sidebarMenus,
 *   profileSection,
 *   isLoading,
 *   isError,
 *   error,
 *   selectMainMenu,
 * } = useMenuData();
 * ```
 */
export const useMenuData = () => {
    // Fetch menu data from React Query
    const { data: menuData, isLoading, isError, error, refetch } = useMenuQuery();

    // Get current location for URL-based selection
    const location = useLocation();

    // Get UI state from Zustand
    const {
        selectedMainMenuKey,
        setSelectedMainMenuKey,
        selectedSidebarKey,
        setSelectedSidebarKey,
        openSidebarKeys,
        setOpenSidebarKeys,
        isMenuCollapsed,
        setMenuCollapse,
        toggleMenuCollapse,
    } = useMenuStore();

    // Extract main menus from data
    const mainMenus = useMemo(() => {
        if (!menuData) return [];

        // Handle both array format and object format
        if (Array.isArray(menuData)) {
            return menuData;
        }

        if (menuData.mainNavigation) {
            return menuData.mainNavigation;
        }

        return [];
    }, [menuData]);

    // Get profile section
    const profileSection = useMemo(() => {
        if (!menuData || Array.isArray(menuData)) return null;
        return menuData.profileSection || null;
    }, [menuData]);

    // Get config from API response
    const menuConfig = useMemo(() => {
        if (!menuData || Array.isArray(menuData)) return {};
        return menuData.config || {};
    }, [menuData]);

    // Auto-select first main menu on initial load (only if no selection exists)
    useEffect(() => {
        if (mainMenus.length > 0 && !selectedMainMenuKey) {
            // Check if config has defaultSelectedKeys
            const defaultKey = menuConfig.defaultSelectedKeys?.[0] || mainMenus[0].key;
            setSelectedMainMenuKey(defaultKey);
        }
    }, [mainMenus, selectedMainMenuKey, setSelectedMainMenuKey, menuConfig]);

    // Get selected main menu object
    const selectedMainMenu = useMemo(() => {
        if (!selectedMainMenuKey || mainMenus.length === 0) return null;
        return mainMenus.find((menu) => menu.key === selectedMainMenuKey) || null;
    }, [mainMenus, selectedMainMenuKey]);

    // Get sidebar menus (children of selected main menu)
    const sidebarMenus = useMemo(() => {
        return selectedMainMenu?.children || [];
    }, [selectedMainMenu]);

    // Sync selection with current URL on page load/refresh
    useEffect(() => {
        if (sidebarMenus.length === 0 || !location.pathname) return;

        // Build base route for comparison - use route property if available
        const mainMenuRoute = selectedMainMenu?.route || selectedMainMenu?.key;
        const baseRoute = selectedMainMenu ? `/apps/${mainMenuRoute}` : '';

        // Extract the path after base route
        const pathAfterBase = location.pathname.startsWith(baseRoute)
            ? location.pathname.substring(baseRoute.length)
            : location.pathname;

        // Split path into segments
        const pathSegments = pathAfterBase.split('/').filter(s => s);

        if (pathSegments.length === 0) return;

        // Find menu item by matching path segments with menu route or key
        const findMenuByPathSegments = (menus, segments, depth = 0) => {
            if (depth >= segments.length) return null;

            const currentSegment = segments[depth];

            for (const menu of menus) {
                // Get menu's slug (route or key)
                const menuSlug = (menu.route && menu.route !== null && menu.route.trim() !== '')
                    ? menu.route.replace(/^\/+|\/+$/g, '') // Clean route
                    : menu.key;

                // Check if current menu slug matches the segment
                if (menuSlug === currentSegment) {
                    // If this is the last segment, we found our menu
                    if (depth === segments.length - 1) {
                        return menu;
                    }
                    // Otherwise, search in children
                    if (menu.children && menu.children.length > 0) {
                        const found = findMenuByPathSegments(menu.children, segments, depth + 1);
                        if (found) return found;
                    }
                    return menu; // Return this menu if no children match
                }
            }
            return null;
        };

        const matchedMenu = findMenuByPathSegments(sidebarMenus, pathSegments);

        if (matchedMenu && matchedMenu.key !== selectedSidebarKey) {
            // Update selection to match URL
            setSelectedSidebarKey(matchedMenu.key);

            // Auto-expand parent menus
            const parentKeys = getParentKeys(sidebarMenus, matchedMenu.key);
            if (parentKeys && parentKeys.length > 0) {
                setOpenSidebarKeys(parentKeys);
            }
        }
    }, [location.pathname, sidebarMenus, selectedSidebarKey, selectedMainMenu, setSelectedSidebarKey, setOpenSidebarKeys]);

    // Smart auto-selection and expansion for sidebar menus
    useEffect(() => {
        if (sidebarMenus.length === 0) return;

        // If we have a selected sidebar key, ensure it's expanded properly
        if (selectedSidebarKey) {
            const selectedItem = findMenuByKey(sidebarMenus, selectedSidebarKey);
            if (selectedItem) {
                // Get parent keys to auto-expand
                const parentKeys = getParentKeys(sidebarMenus, selectedSidebarKey);
                if (parentKeys && parentKeys.length > 0) {
                    // Merge with existing open keys to preserve user's manual expansions
                    const newOpenKeys = [...new Set([...openSidebarKeys, ...parentKeys])];
                    if (JSON.stringify(newOpenKeys.sort()) !== JSON.stringify(openSidebarKeys.sort())) {
                        setOpenSidebarKeys(newOpenKeys);
                    }
                }
                return; // Don't auto-select if we already have a valid selection
            }
        }

        // Auto-select first available menu item (could be nested)
        const findFirstSelectableItem = (menus) => {
            for (const menu of menus) {
                // If menu has a route or is selectable, select it
                if (menu.route || !menu.children || menu.children.length === 0) {
                    return menu;
                }
                // Otherwise, look in children
                if (menu.children && menu.children.length > 0) {
                    const found = findFirstSelectableItem(menu.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const firstItem = findFirstSelectableItem(sidebarMenus);
        if (firstItem) {
            setSelectedSidebarKey(firstItem.key);
            // Auto-expand parent menus
            const parentKeys = getParentKeys(sidebarMenus, firstItem.key);
            if (parentKeys && parentKeys.length > 0) {
                setOpenSidebarKeys(parentKeys);
            }
        }
    }, [sidebarMenus, selectedSidebarKey, setSelectedSidebarKey, openSidebarKeys, setOpenSidebarKeys]);

    /**
     * Select a main menu by key
     * @param {string} key - Main menu key
     */
    const selectMainMenu = (key) => {
        setSelectedMainMenuKey(key);
        // Reset sidebar selection when main menu changes
        setSelectedSidebarKey('');
        setOpenSidebarKeys([]);
    };

    /**
     * Select a sidebar menu item and auto-expand parents
     * @param {string} key - Sidebar menu key
     */
    const selectSidebarMenu = (key) => {
        setSelectedSidebarKey(key);
        // Auto-expand parent menus
        const parentKeys = getParentKeys(sidebarMenus, key);
        if (parentKeys && parentKeys.length > 0) {
            // Merge with existing open keys
            const newOpenKeys = [...new Set([...openSidebarKeys, ...parentKeys])];
            setOpenSidebarKeys(newOpenKeys);
        }
    };

    /**
     * Select a main menu by index
     * @param {number} index - Main menu index
     */
    const selectMainMenuByIndex = (index) => {
        if (mainMenus[index]) {
            selectMainMenu(mainMenus[index].key);
        }
    };

    /**
     * Get main menu by key
     * @param {string} key - Main menu key
     * @returns {Object|undefined} Main menu object
     */
    const getMainMenuByKey = (key) => {
        return mainMenus.find((menu) => menu.key === key);
    };

    /**
     * Get sidebar menu by key (recursive search)
     * @param {string} key - Sidebar menu key
     * @returns {Object|undefined} Sidebar menu object
     */
    const getSidebarMenuByKey = (key) => {
        return findMenuByKey(sidebarMenus, key);
    };

    /**
     * Build route for a menu key
     * @param {string} key - Menu key
     * @returns {string|null} Full route path
     */
    const getMenuRoute = (key) => {
        // Extract base route from current location
        // Example: /apps/adminApp/something -> /apps/adminApp
        let baseRoute = '';

        if (selectedMainMenu) {
            // Build base route dynamically from selected main menu
            // Use route property if available, otherwise fall back to key
            const mainMenuRoute = (selectedMainMenu.route && selectedMainMenu.route.trim() !== '')
                ? selectedMainMenu.route
                : selectedMainMenu.key;
            baseRoute = `/apps/${mainMenuRoute}`;
        }

        return buildMenuRoute(sidebarMenus, key, baseRoute);
    };

    return {
        // Data
        mainMenus,
        selectedMainMenu,
        sidebarMenus,
        profileSection,
        menuConfig,
        completeMenuData: menuData,

        // Loading states
        isLoading,
        isError,
        error,

        // UI State
        selectedMainMenuKey,
        selectedSidebarKey,
        openSidebarKeys,
        isMenuCollapsed,

        // Actions
        selectMainMenu,
        selectSidebarMenu,
        selectMainMenuByIndex,
        setSelectedSidebarKey,
        setOpenSidebarKeys,
        setMenuCollapse,
        toggleMenuCollapse,
        refetch,

        // Helpers
        getMainMenuByKey,
        getSidebarMenuByKey,
        getMenuRoute,
        findMenuByKey: (key) => findMenuByKey(sidebarMenus, key),
        getParentKeys: (key) => getParentKeys(sidebarMenus, key),
    };
};

export default useMenuData;
