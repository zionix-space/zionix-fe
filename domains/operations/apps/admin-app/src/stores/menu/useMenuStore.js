/**
 * Admin Menu Store
 * 
 * Self-contained menu state management for the admin module.
 * This replaces the dependency on the host app's menu store,
 * following proper microfrontend architecture principles.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Initial menu data structure
const initialMenuData = {
  mainMenus: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'DashboardOutlined',
      path: '/dashboard',
      disabled: false,
      readonly: false,
      order: 1
    },
    {
      key: 'forms',
      label: 'Forms',
      icon: 'FileOutlined',
      path: '/form-setup',
      disabled: false,
      readonly: false,
      order: 2
    },
    {
      key: 'menus',
      label: 'Menus',
      icon: 'MenuOutlined',
      path: '/menu-setup',
      disabled: false,
      readonly: false,
      order: 3
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'SettingOutlined',
      path: '/settings',
      disabled: false,
      readonly: false,
      order: 4
    }
  ],
  sidebarMenus: {
    dashboard: [
      {
        key: 'overview',
        label: 'Overview',
        icon: 'AppstoreOutlined',
        path: '/dashboard/overview',
        disabled: false,
        readonly: false,
        order: 1
      },
      {
        key: 'analytics',
        label: 'Analytics',
        icon: 'BarChartOutlined',
        path: '/dashboard/analytics',
        disabled: false,
        readonly: false,
        order: 2
      }
    ],
    forms: [
      {
        key: 'form-builder',
        label: 'Form Builder',
        icon: 'FormOutlined',
        path: '/form-setup/builder',
        disabled: false,
        readonly: false,
        order: 1
      },
      {
        key: 'form-templates',
        label: 'Templates',
        icon: 'FileTextOutlined',
        path: '/form-setup/templates',
        disabled: false,
        readonly: false,
        order: 2
      }
    ],
    menus: [
      {
        key: 'menu-builder',
        label: 'Menu Builder',
        icon: 'MenuOutlined',
        path: '/menu-setup/builder',
        disabled: false,
        readonly: false,
        order: 1
      },
      {
        key: 'menu-templates',
        label: 'Menu Templates',
        icon: 'FolderOutlined',
        path: '/menu-setup/templates',
        disabled: false,
        readonly: false,
        order: 2
      }
    ],
    settings: [
      {
        key: 'general',
        label: 'General',
        icon: 'SettingOutlined',
        path: '/settings/general',
        disabled: false,
        readonly: false,
        order: 1
      },
      {
        key: 'permissions',
        label: 'Permissions',
        icon: 'LockOutlined',
        path: '/settings/permissions',
        disabled: false,
        readonly: false,
        order: 2
      }
    ]
  }
};

export const useMenuStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        mainMenus: initialMenuData.mainMenus,
        sidebarMenus: initialMenuData.sidebarMenus,
        selectedMainMenu: 'dashboard',
        selectedSidebarMenu: null,
        isLoading: false,
        error: null,
        
        // Computed values
        get completeMenuData() {
          const state = get();
          return {
            mainMenus: state.mainMenus,
            sidebarMenus: state.sidebarMenus
          };
        },

        get currentSidebarMenus() {
          const state = get();
          return state.sidebarMenus[state.selectedMainMenu] || [];
        },

        // Actions
        setSelectedMainMenu: (menuKey) => set(() => ({
          selectedMainMenu: menuKey,
          selectedSidebarMenu: null
        })),

        setSelectedSidebarMenu: (menuKey) => set(() => ({
          selectedSidebarMenu: menuKey
        })),

        // Main menu CRUD operations
        addMainMenu: (menuItem) => set((state) => {
          const newMenu = {
            ...menuItem,
            key: menuItem.key || `menu-${Date.now()}`,
            order: state.mainMenus.length + 1,
            disabled: false,
            readonly: false
          };
          
          return {
            mainMenus: [...state.mainMenus, newMenu],
            sidebarMenus: {
              ...state.sidebarMenus,
              [newMenu.key]: state.sidebarMenus[newMenu.key] || []
            }
          };
        }),

        updateMainMenu: (menuKey, updates) => set((state) => ({
          mainMenus: state.mainMenus.map(menu => 
            menu.key === menuKey ? { ...menu, ...updates } : menu
          )
        })),

        deleteMainMenu: (menuKey) => set((state) => {
          const newSidebarMenus = { ...state.sidebarMenus };
          delete newSidebarMenus[menuKey];
          
          const newSelectedMainMenu = state.selectedMainMenu === menuKey 
            ? state.mainMenus.find(menu => menu.key !== menuKey)?.key || null
            : state.selectedMainMenu;
          
          return {
            mainMenus: state.mainMenus.filter(menu => menu.key !== menuKey),
            sidebarMenus: newSidebarMenus,
            selectedMainMenu: newSelectedMainMenu,
            selectedSidebarMenu: state.selectedMainMenu === menuKey ? null : state.selectedSidebarMenu
          };
        }),

        reorderMainMenus: (fromIndex, toIndex) => set((state) => {
          const newMainMenus = [...state.mainMenus];
          const [movedMenu] = newMainMenus.splice(fromIndex, 1);
          newMainMenus.splice(toIndex, 0, movedMenu);
          
          // Update order values
          const updatedMenus = newMainMenus.map((menu, index) => ({
            ...menu,
            order: index + 1
          }));
          
          return { mainMenus: updatedMenus };
        }),

        // Sidebar menu CRUD operations
        addSidebarMenu: (parentKey, menuItem) => set((state) => {
          const currentSidebarMenus = state.sidebarMenus[parentKey] || [];
          const newMenu = {
            ...menuItem,
            key: menuItem.key || `submenu-${Date.now()}`,
            order: currentSidebarMenus.length + 1,
            disabled: false,
            readonly: false
          };
          
          return {
            sidebarMenus: {
              ...state.sidebarMenus,
              [parentKey]: [...currentSidebarMenus, newMenu]
            }
          };
        }),

        updateSidebarMenu: (parentKey, menuKey, updates) => set((state) => {
          const currentSidebarMenus = state.sidebarMenus[parentKey];
          if (!currentSidebarMenus) return state;
          
          return {
            sidebarMenus: {
              ...state.sidebarMenus,
              [parentKey]: currentSidebarMenus.map(menu =>
                menu.key === menuKey ? { ...menu, ...updates } : menu
              )
            }
          };
        }),

        deleteSidebarMenu: (parentKey, menuKey) => set((state) => {
          const currentSidebarMenus = state.sidebarMenus[parentKey];
          if (!currentSidebarMenus) return state;
          
          return {
            sidebarMenus: {
              ...state.sidebarMenus,
              [parentKey]: currentSidebarMenus.filter(menu => menu.key !== menuKey)
            },
            selectedSidebarMenu: state.selectedSidebarMenu === menuKey ? null : state.selectedSidebarMenu
          };
        }),

        reorderSidebarMenus: (parentKey, fromIndex, toIndex) => set((state) => {
          const currentSidebarMenus = state.sidebarMenus[parentKey];
          if (!currentSidebarMenus) return state;
          
          const newSidebarMenus = [...currentSidebarMenus];
          const [movedMenu] = newSidebarMenus.splice(fromIndex, 1);
          newSidebarMenus.splice(toIndex, 0, movedMenu);
          
          // Update order values
          const updatedMenus = newSidebarMenus.map((menu, index) => ({
            ...menu,
            order: index + 1
          }));
          
          return {
            sidebarMenus: {
              ...state.sidebarMenus,
              [parentKey]: updatedMenus
            }
          };
        }),

        // Bulk operations
        resetToDefaults: () => set(() => ({
          mainMenus: initialMenuData.mainMenus,
          sidebarMenus: initialMenuData.sidebarMenus,
          selectedMainMenu: 'dashboard',
          selectedSidebarMenu: null,
          error: null
        })),

        importMenuData: (menuData) => set((state) => ({
          ...state,
          mainMenus: menuData.mainMenus || state.mainMenus,
          sidebarMenus: menuData.sidebarMenus || state.sidebarMenus,
          error: null
        })),

        exportMenuData: () => {
          const state = get();
          return {
            mainMenus: state.mainMenus,
            sidebarMenus: state.sidebarMenus,
            exportedAt: new Date().toISOString()
          };
        },

        // Error handling
        setError: (error) => set(() => ({ error })),

        clearError: () => set(() => ({ error: null })),

        // Loading state
        setLoading: (loading) => set(() => ({ isLoading: loading }))
      }),
      {
        name: 'admin-menu-store',
        version: 1,
        partialize: (state) => ({
          mainMenus: state.mainMenus,
          sidebarMenus: state.sidebarMenus,
          selectedMainMenu: state.selectedMainMenu
        })
      }
    ),
    {
      name: 'admin-menu-store'
    }
  )
);