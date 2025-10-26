/**
 * @fileoverview Menu Data Hook
 * 
 * Custom hook for managing menu data using TanStack Query.
 * Provides CRUD operations, loading states, and cache management for menu data.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../../api/menu/menuService";
import { queryKeys } from "../../config/queryKeys";
import { useMenuStore } from "../../stores/menu/useMenuStore";

/**
 * Hook for managing menu page data with TanStack Query
 * 
 * @returns {Object} Menu data management object
 * @returns {Object} returns.data - Menu data
 * @returns {Array} returns.data.menus - Menu list
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {boolean} returns.isError - Error state
 * @returns {Function} returns.refetchAll - Refetch all menu data
 * @returns {Object} returns.mutations - CRUD mutation functions
 * 
 * @example
 * ```js
 * const { data, isLoading, mutations } = useMenuPageData();
 * 
 * // Access menu data
 * console.log(data.menus);
 * 
 * // Create new menu
 * mutations.createMenu.mutate({ name: 'New Menu', path: '/new' });
 * ```
 */
export const useMenuPageData = () => {
  const { setMenuList } = useMenuStore();
  const queryClient = useQueryClient();

  // --- QUERIES ---
  
  /**
   * Query for fetching menu list
   */
  const menuListQuery = useQuery({
    queryKey: queryKeys.menu.pages(),
    queryFn: menuService.getMenuList,
    onSuccess: (data) => {
      // Update Zustand store when data is fetched
      setMenuList(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Query for fetching navigation data
   */
  const navigationQuery = useQuery({
    queryKey: queryKeys.menu.navigation(),
    queryFn: menuService.getNavigation,
    staleTime: 10 * 60 * 1000, // 10 minutes - navigation changes less frequently
  });

  // --- MUTATIONS (CRUD) ---
  
  /**
   * Mutation for creating new menu
   */
  const createMenu = useMutation({
    mutationFn: menuService.createMenu,
    onSuccess: () => {
      // Invalidate and refetch menu queries
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
    onError: (error) => {
      console.error('Failed to create menu:', error);
    },
  });

  /**
   * Mutation for updating existing menu
   */
  const updateMenu = useMutation({
    mutationFn: menuService.updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
    onError: (error) => {
      console.error('Failed to update menu:', error);
    },
  });

  /**
   * Mutation for deleting menu
   */
  const deleteMenu = useMutation({
    mutationFn: menuService.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
    onError: (error) => {
      console.error('Failed to delete menu:', error);
    },
  });

  /**
   * Mutation for bulk deleting menus
   */
  const bulkDeleteMenus = useMutation({
    mutationFn: menuService.bulkDeleteMenus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
    onError: (error) => {
      console.error('Failed to bulk delete menus:', error);
    },
  });

  // --- AGGREGATE STATES ---
  
  const isLoading = menuListQuery.isFetching || navigationQuery.isFetching;
  const isError = menuListQuery.isError || navigationQuery.isError;
  const error = menuListQuery.error || navigationQuery.error;

  /**
   * Refetch all menu-related data
   */
  const refetchAll = () => {
    menuListQuery.refetch();
    navigationQuery.refetch();
  };

  return {
    // Data
    data: {
      menus: menuListQuery.data,
      navigation: navigationQuery.data,
    },
    
    // States
    isLoading,
    isError,
    error,
    
    // Actions
    refetchAll,
    
    // Mutations
    mutations: {
      createMenu,
      updateMenu,
      deleteMenu,
      bulkDeleteMenus,
    },
    
    // Individual query states for granular control
    queries: {
      menuList: menuListQuery,
      navigation: navigationQuery,
    },
  };
};

export default useMenuPageData;