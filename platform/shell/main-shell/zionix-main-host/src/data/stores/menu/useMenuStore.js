/**
 * @fileoverview Menu Zustand Store
 * 
 * Zustand store for managing menu state across the application.
 * Provides persistent storage for menu data and related UI state.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

/**
 * Menu store interface
 * @typedef {Object} MenuStore
 * @property {Array} menuList - List of menu items
 * @property {Object|null} selectedMenu - Currently selected menu item
 * @property {boolean} isMenuCollapsed - Menu collapse state
 * @property {string} activeMenuId - ID of the active menu item
 * @property {Function} setMenuList - Set menu list
 * @property {Function} setSelectedMenu - Set selected menu
 * @property {Function} toggleMenuCollapse - Toggle menu collapse state
 * @property {Function} setActiveMenuId - Set active menu ID
 * @property {Function} addMenuItem - Add new menu item
 * @property {Function} updateMenuItem - Update existing menu item
 * @property {Function} removeMenuItem - Remove menu item
 * @property {Function} clearMenuData - Clear all menu data
 */

/**
 * Zustand store for menu management
 * 
 * @example
 * ```js
 * import { useMenuStore } from '@/data/stores/menu/useMenuStore';
 * 
 * const { menuList, setMenuList, toggleMenuCollapse } = useMenuStore();
 * ```
 */
export const useMenuStore = create(
  devtools(
    persist(
      (set, get) => ({
        // --- STATE ---
        
        /** @type {Array} List of menu items */
        menuList: [],
        
        /** @type {Object|null} Currently selected menu item */
        selectedMenu: null,
        
        /** @type {boolean} Menu collapse state for responsive design */
        isMenuCollapsed: false,
        
        /** @type {string} ID of the active menu item */
        activeMenuId: '',
        
        // --- ACTIONS ---
        
        /**
         * Set the complete menu list
         * @param {Array} data - Menu list data
         */
        setMenuList: (data) => set(
          { menuList: Array.isArray(data) ? data : [] },
          false,
          'setMenuList'
        ),
        
        /**
         * Set the selected menu item
         * @param {Object|null} menu - Menu item object
         */
        setSelectedMenu: (menu) => set(
          { selectedMenu: menu },
          false,
          'setSelectedMenu'
        ),
        
        /**
         * Toggle menu collapse state
         */
        toggleMenuCollapse: () => set(
          (state) => ({ isMenuCollapsed: !state.isMenuCollapsed }),
          false,
          'toggleMenuCollapse'
        ),
        
        /**
         * Set menu collapse state
         * @param {boolean} collapsed - Collapse state
         */
        setMenuCollapse: (collapsed) => set(
          { isMenuCollapsed: Boolean(collapsed) },
          false,
          'setMenuCollapse'
        ),
        
        /**
         * Set active menu ID
         * @param {string} id - Menu item ID
         */
        setActiveMenuId: (id) => set(
          { activeMenuId: String(id || '') },
          false,
          'setActiveMenuId'
        ),
        
        /**
         * Add new menu item to the list
         * @param {Object} menuItem - New menu item
         */
        addMenuItem: (menuItem) => set(
          (state) => ({
            menuList: [...state.menuList, menuItem]
          }),
          false,
          'addMenuItem'
        ),
        
        /**
         * Update existing menu item
         * @param {string} id - Menu item ID
         * @param {Object} updates - Updates to apply
         */
        updateMenuItem: (id, updates) => set(
          (state) => ({
            menuList: state.menuList.map(item =>
              item.id === id ? { ...item, ...updates } : item
            )
          }),
          false,
          'updateMenuItem'
        ),
        
        /**
         * Remove menu item from the list
         * @param {string} id - Menu item ID to remove
         */
        removeMenuItem: (id) => set(
          (state) => ({
            menuList: state.menuList.filter(item => item.id !== id),
            selectedMenu: state.selectedMenu?.id === id ? null : state.selectedMenu,
            activeMenuId: state.activeMenuId === id ? '' : state.activeMenuId,
          }),
          false,
          'removeMenuItem'
        ),
        
        /**
         * Clear all menu data
         */
        clearMenuData: () => set(
          {
            menuList: [],
            selectedMenu: null,
            activeMenuId: '',
          },
          false,
          'clearMenuData'
        ),
        
        // --- COMPUTED/GETTERS ---
        
        /**
         * Get menu item by ID
         * @param {string} id - Menu item ID
         * @returns {Object|undefined} Menu item or undefined
         */
        getMenuById: (id) => {
          const state = get();
          return state.menuList.find(item => item.id === id);
        },
        
        /**
         * Get active menu item
         * @returns {Object|undefined} Active menu item or undefined
         */
        getActiveMenu: () => {
          const state = get();
          return state.menuList.find(item => item.id === state.activeMenuId);
        },
      }),
      {
        name: 'menu-store', // localStorage key
        storage: createJSONStorage(() => localStorage),
        
        // Only persist essential data
        partialize: (state) => ({
          menuList: state.menuList,
          isMenuCollapsed: state.isMenuCollapsed,
          activeMenuId: state.activeMenuId,
        }),
        
        // Version for migration support
        version: 1,
      }
    ),
    {
      name: 'menu-store', // DevTools name
    }
  )
);

export default useMenuStore;