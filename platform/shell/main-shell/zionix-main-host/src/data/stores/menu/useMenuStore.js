/**
 * @fileoverview Enhanced Menu Zustand Store
 *
 * Zustand store for managing dynamic menu state across the application.
 * Handles main menu items (topbar) and selected menu children (sidebar).
 *
 * @author Zionix Platform Team
 * @version 2.0.0
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

/**
 * Enhanced Menu store interface
 * @typedef {Object} MenuStore
 * @property {Array} mainMenus - Main menu items for topbar
 * @property {Object|null} selectedMainMenu - Currently selected main menu
 * @property {Array} sidebarMenus - Children of selected main menu for sidebar
 * @property {string} selectedSidebarKey - Selected sidebar menu key
 * @property {Array} openSidebarKeys - Open sidebar menu keys
 * @property {boolean} isMenuCollapsed - Menu collapse state
 * @property {boolean} isLoading - Loading state for menu data
 * @property {Function} setMainMenus - Set main menu list
 * @property {Function} setSelectedMainMenu - Set selected main menu
 * @property {Function} setSidebarMenus - Set sidebar menu items
 * @property {Function} setSelectedSidebarKey - Set selected sidebar key
 * @property {Function} setOpenSidebarKeys - Set open sidebar keys
 * @property {Function} toggleMenuCollapse - Toggle menu collapse state
 * @property {Function} initializeMenus - Initialize menus with auto-selection
 * @property {Function} selectMainMenuByIndex - Select main menu by index
 * @property {Function} clearMenuData - Clear all menu data
 */

/**
 * Enhanced Zustand store for dynamic menu management
 *
 * @example
 * ```js
 * import { useMenuStore } from '@/data/stores/menu/useMenuStore';
 *
 * const { mainMenus, selectedMainMenu, sidebarMenus, setSelectedMainMenu } = useMenuStore();
 * ```
 */
export const useMenuStore = create(
  devtools(
    persist(
      (set, get) => ({
        // --- STATE ---

        /** @type {Array} Main menu items for topbar */
        mainMenus: [],

        /** @type {Object|null} Currently selected main menu */
        selectedMainMenu: null,

        /** @type {Array} Children of selected main menu for sidebar */
        sidebarMenus: [],

        /** @type {string} Selected sidebar menu key */
        selectedSidebarKey: '',

        /** @type {Array} Open sidebar menu keys for Ant Design Menu */
        openSidebarKeys: [],

        /** @type {boolean} Menu collapse state for responsive design */
        isMenuCollapsed: false,

        /** @type {boolean} Loading state for menu data */
        isLoading: false,

        /** @type {Object|null} Complete menu data including accountSettings and profileSection */
        completeMenuData: null,

        /** @type {string|null} Current menu data version for cache invalidation */
        menuVersion: null,

        /** @type {number|null} Last sync timestamp for cache management */
        lastSyncTime: null,

        // --- ACTIONS ---

        /**
         * Set the main menu list for topbar
         * @param {Array} data - Main menu list data
         */
        setMainMenus: (data) =>
          set(
            { mainMenus: Array.isArray(data) ? data : [] },
            false,
            'setMainMenus'
          ),

        /**
         * Set the selected main menu and update sidebar
         * @param {Object|null} menu - Main menu item object
         */
        setSelectedMainMenu: (menu) => {
          const sidebarMenus = menu?.children || [];
          const firstSidebarKey =
            sidebarMenus.length > 0 ? sidebarMenus[0].key : '';

          set(
            {
              selectedMainMenu: menu,
              sidebarMenus,
              selectedSidebarKey: firstSidebarKey,
              openSidebarKeys:
                sidebarMenus.length > 0 ? [sidebarMenus[0].key] : [],
            },
            false,
            'setSelectedMainMenu'
          );
        },

        /**
         * Set sidebar menu items
         * @param {Array} data - Sidebar menu items
         */
        setSidebarMenus: (data) =>
          set(
            { sidebarMenus: Array.isArray(data) ? data : [] },
            false,
            'setSidebarMenus'
          ),

        /**
         * Set selected sidebar menu key
         * @param {string} key - Sidebar menu key
         */
        setSelectedSidebarKey: (key) =>
          set(
            { selectedSidebarKey: String(key || '') },
            false,
            'setSelectedSidebarKey'
          ),

        /**
         * Set open sidebar menu keys
         * @param {Array} keys - Array of open menu keys
         */
        setOpenSidebarKeys: (keys) =>
          set(
            { openSidebarKeys: Array.isArray(keys) ? keys : [] },
            false,
            'setOpenSidebarKeys'
          ),

        /**
         * Toggle menu collapse state
         */
        toggleMenuCollapse: () =>
          set(
            (state) => ({ isMenuCollapsed: !state.isMenuCollapsed }),
            false,
            'toggleMenuCollapse'
          ),

        /**
         * Set menu collapse state
         * @param {boolean} collapsed - Collapse state
         */
        setMenuCollapse: (collapsed) =>
          set(
            { isMenuCollapsed: Boolean(collapsed) },
            false,
            'setMenuCollapse'
          ),

        /**
         * Set loading state
         * @param {boolean} loading - Loading state
         */
        setLoading: (loading) =>
          set({ isLoading: Boolean(loading) }, false, 'setLoading'),

        /**
         * Initialize menus with comprehensive menu data structure
         * @param {Object} menuData - Complete menu data object with mainNavigation, accountSettings, profileSection
         */
        initializeMenus: (menuData) => {
          // Handle both old array format and new object format for backward compatibility
          let mainMenus = [];

          if (Array.isArray(menuData)) {
            // Old format - direct array
            mainMenus = menuData;
          } else if (menuData && menuData.mainNavigation) {
            // New format - object with mainNavigation property
            mainMenus = menuData.mainNavigation;
          }

          const firstMainMenu = mainMenus.length > 0 ? mainMenus[0] : null;
          const sidebarMenus = firstMainMenu?.children || [];
          const firstSidebarKey =
            sidebarMenus.length > 0 ? sidebarMenus[0].key : '';

          set(
            {
              mainMenus,
              selectedMainMenu: firstMainMenu,
              sidebarMenus,
              selectedSidebarKey: firstSidebarKey,
              openSidebarKeys:
                sidebarMenus.length > 0 ? [sidebarMenus[0].key] : [],
              isLoading: false,
              // Store the complete menu data for access to accountSettings and profileSection
              completeMenuData: menuData,
            },
            false,
            'initializeMenus'
          );
        },

        /**
         * Select main menu by index
         * @param {number} index - Index of main menu to select
         */
        selectMainMenuByIndex: (index) => {
          const state = get();
          const menu = state.mainMenus[index];
          if (menu) {
            const sidebarMenus = menu.children || [];
            const firstSidebarKey =
              sidebarMenus.length > 0 ? sidebarMenus[0].key : '';

            set(
              {
                selectedMainMenu: menu,
                sidebarMenus,
                selectedSidebarKey: firstSidebarKey,
                openSidebarKeys:
                  sidebarMenus.length > 0 ? [sidebarMenus[0].key] : [],
              },
              false,
              'selectMainMenuByIndex'
            );
          }
        },

        /**
         * Check if menu data needs to be refreshed based on version
         * @param {Object} newMenuData - New menu data from API
         * @returns {boolean} Whether data should be updated
         */
        shouldUpdateMenuData: (newMenuData) => {
          const state = get();
          const currentVersion = state.menuVersion;
          const newVersion = newMenuData?.config?.version;
          
          // Update if no current version or versions differ
          return !currentVersion || currentVersion !== newVersion;
        },

        /**
         * Update menu version tracking
         * @param {string} version - New version
         */
        setMenuVersion: (version) => 
          set({ menuVersion: version, lastSyncTime: Date.now() }, false, 'setMenuVersion'),

        /**
         * Clear all menu data
         */
        clearMenuData: () =>
          set(
            {
              mainMenus: [],
              selectedMainMenu: null,
              sidebarMenus: [],
              selectedSidebarKey: '',
              openSidebarKeys: [],
              isLoading: false,
              completeMenuData: null,
              menuVersion: null,
              lastSyncTime: null,
            },
            false,
            'clearMenuData'
          ),

        // --- COMPUTED/GETTERS ---

        /**
         * Get main menu by key
         * @param {string} key - Main menu key
         * @returns {Object|undefined} Main menu item or undefined
         */
        getMainMenuByKey: (key) => {
          const state = get();
          return state.mainMenus.find((item) => item.key === key);
        },

        /**
         * Get sidebar menu by key
         * @param {string} key - Sidebar menu key
         * @returns {Object|undefined} Sidebar menu item or undefined
         */
        getSidebarMenuByKey: (key) => {
          const state = get();
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
          return findInMenus(state.sidebarMenus);
        },

        /**
         * Get current selected main menu
         * @returns {Object|null} Selected main menu or null
         */
        getCurrentMainMenu: () => {
          const state = get();
          return state.selectedMainMenu;
        },

        /**
         * Get current sidebar menus
         * @returns {Array} Current sidebar menu items
         */
        getCurrentSidebarMenus: () => {
          const state = get();
          return state.sidebarMenus;
        },
      }),
      {
        name: 'menu-store', // localStorage key
        storage: createJSONStorage(() => localStorage),

        // Only persist essential data
        partialize: (state) => ({
          mainMenus: state.mainMenus,
          selectedMainMenu: state.selectedMainMenu,
          sidebarMenus: state.sidebarMenus,
          isMenuCollapsed: state.isMenuCollapsed,
          selectedSidebarKey: state.selectedSidebarKey,
          openSidebarKeys: state.openSidebarKeys,
          completeMenuData: state.completeMenuData,
          menuVersion: state.menuVersion,
          lastSyncTime: state.lastSyncTime,
        }),

        // Ensure sidebarMenus is populated from selectedMainMenu after rehydration
        onRehydrateStorage: () => (state) => {
          // Ensure sidebarMenus is populated from selectedMainMenu after rehydration
          if (state && state.selectedMainMenu && (!state.sidebarMenus || state.sidebarMenus.length === 0)) {
            state.sidebarMenus = state.selectedMainMenu.children || [];
          }
        },

        // Version for migration support
        version: 2,
      }
    ),
    {
      name: 'menu-store', // DevTools name
    }
  )
);

export default useMenuStore;
