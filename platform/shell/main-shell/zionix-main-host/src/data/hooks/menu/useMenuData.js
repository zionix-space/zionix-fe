/**
 * @fileoverview Menu Data Management Hook
 * 
 * Custom hook that combines React Query for data fetching with Zustand for UI state.
 * Provides a clean API for components to access menu data and manage selection state.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useMemo, useEffect } from 'react';
import { useMenuQuery } from './useMenuQuery';
import { useMenuStore } from '../../stores/menu/useMenuStore';

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

    // Auto-select first main menu on initial load
    useEffect(() => {
        if (mainMenus.length > 0 && !selectedMainMenuKey) {
            setSelectedMainMenuKey(mainMenus[0].key);
        }
    }, [mainMenus, selectedMainMenuKey, setSelectedMainMenuKey]);

    // Get selected main menu object
    const selectedMainMenu = useMemo(() => {
        if (!selectedMainMenuKey || mainMenus.length === 0) return null;
        return mainMenus.find((menu) => menu.key === selectedMainMenuKey) || null;
    }, [mainMenus, selectedMainMenuKey]);

    // Get sidebar menus (children of selected main menu)
    const sidebarMenus = useMemo(() => {
        return selectedMainMenu?.children || [];
    }, [selectedMainMenu]);

    // Auto-select first sidebar menu when main menu changes
    useEffect(() => {
        if (sidebarMenus.length > 0 && !selectedSidebarKey) {
            setSelectedSidebarKey(sidebarMenus[0].key);
            setOpenSidebarKeys([sidebarMenus[0].key]);
        }
    }, [sidebarMenus, selectedSidebarKey, setSelectedSidebarKey, setOpenSidebarKeys]);

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
        const findInMenus = (menus) => {
            for (const menu of menus) {
                if (menu.key === key) return menu;
                if (menu.children) {
                    const found = findInMenus(menu.children);
                    if (found) return found;
                }
            }
            return undefined;
        };
        return findInMenus(sidebarMenus);
    };

    return {
        // Data
        mainMenus,
        selectedMainMenu,
        sidebarMenus,
        profileSection,
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
        selectMainMenuByIndex,
        setSelectedSidebarKey,
        setOpenSidebarKeys,
        setMenuCollapse,
        toggleMenuCollapse,
        refetch,

        // Helpers
        getMainMenuByKey,
        getSidebarMenuByKey,
    };
};

export default useMenuData;
