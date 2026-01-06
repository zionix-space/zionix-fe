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
 * @property {string} selectedMainMenuKey - Key of currently selected main menu
 * @property {string} selectedSidebarKey - Selected sidebar menu key
 * @property {Array} openSidebarKeys - Open sidebar menu keys
 * @property {boolean} isMenuCollapsed - Menu collapse state
 * @property {Function} setSelectedMainMenuKey - Set selected main menu key
 * @property {Function} setSelectedSidebarKey - Set selected sidebar key
 * @property {Function} setOpenSidebarKeys - Set open sidebar keys
 * @property {Function} toggleMenuCollapse - Toggle menu collapse state
 * @property {Function} setMenuCollapse - Set menu collapse state
 * @property {Function} clearMenuState - Clear all menu UI state
 */

/**
 * Optimized Zustand store for menu UI state only
 * Menu data is now managed by React Query - this store only handles UI state
 *
 * @example
 * ```js
 * import { useMenuStore } from '@/data/stores/menu/useMenuStore';
 *
 * const { selectedMainMenuKey, setSelectedMainMenuKey } = useMenuStore();
 * ```
 */
export const useMenuStore = create(
  devtools(
    persist(
      (set, get) => ({
        // --- UI STATE ONLY ---

        /** @type {string} Key of currently selected main menu */
        selectedMainMenuKey: '',

        /** @type {string} Selected sidebar menu key */
        selectedSidebarKey: '',

        /** @type {Array} Open sidebar menu keys for Ant Design Menu */
        openSidebarKeys: [],

        /** @type {boolean} Menu collapse state for responsive design */
        isMenuCollapsed: false,

        // --- ACTIONS ---

        /**
         * Set the selected main menu key
         * @param {string} key - Main menu key
         */
        setSelectedMainMenuKey: (key) =>
          set(
            { selectedMainMenuKey: String(key || '') },
            false,
            'setSelectedMainMenuKey'
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
         * Clear all menu UI state
         */
        clearMenuState: () =>
          set(
            {
              selectedMainMenuKey: '',
              selectedSidebarKey: '',
              openSidebarKeys: [],
            },
            false,
            'clearMenuState'
          ),
      }),
      {
        name: 'menu-ui-store', // localStorage key
        storage: createJSONStorage(() => localStorage),

        // Only persist UI state
        partialize: (state) => ({
          selectedMainMenuKey: state.selectedMainMenuKey,
          selectedSidebarKey: state.selectedSidebarKey,
          openSidebarKeys: state.openSidebarKeys,
          isMenuCollapsed: state.isMenuCollapsed,
        }),

        // Version for migration support
        version: 3, // Incremented version for breaking change
      }
    ),
    {
      name: 'menu-ui-store', // DevTools name
    }
  )
);

export default useMenuStore;
