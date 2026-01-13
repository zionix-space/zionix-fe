/**
 * @fileoverview TanStack Query Keys Factory
 * 
 * Centralized query key management for consistent caching and invalidation.
 * This factory provides a structured approach to query key generation,
 * making cache management predictable and maintainable across the application.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 * 
 * @example
 * ```js
 * import { queryKeys } from '@/data/config/queryKeys';
 * 
 * // Use in queries
 * const { data } = useQuery({
 *   queryKey: queryKeys.menu.pages(),
 *   queryFn: menuService.getPages
 * });
 * 
 * // Use for cache invalidation
 * queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
 * ```
 */

/**
 * Query keys factory for consistent key management
 * This helps with cache invalidation and organization
 * 
 * @namespace queryKeys
 */
export const queryKeys = {
  /**
   * Menu-related query keys
   * @namespace queryKeys.menu
   */
  menu: {
    /** Base key for all menu queries */
    all: ['menu'],

    /** Query key for menu list */
    list: () => [...queryKeys.menu.all, 'list'],

    /** Query key for navigation data */
    navigation: () => [...queryKeys.menu.all, 'navigation'],

    /** Query key for specific menu item */
    item: (id) => [...queryKeys.menu.all, 'item', id],
  },

  /**
   * Legacy support - keeping MENUS for backward compatibility
   * @deprecated Use queryKeys.menu.list() instead
   */
  MENUS: () => ["MenuList"],
};

export default queryKeys;