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
    
    /** Query key for menu list/pages */
    pages: () => [...queryKeys.menu.all, 'pages'],
    
    /** Query key for navigation data */
    navigation: () => [...queryKeys.menu.all, 'navigation'],
    
    /** Query key for specific menu item */
    item: (id) => [...queryKeys.menu.all, 'item', id],
  },
  
  /**
   * User-related query keys
   * @namespace queryKeys.user
   */
  user: {
    /** Base key for all user queries */
    all: ['user'],
    
    /** Query key for user profile */
    profile: () => [...queryKeys.user.all, 'profile'],
    
    /** Query key for user preferences */
    preferences: () => [...queryKeys.user.all, 'preferences'],
    
    /** Query key for user permissions */
    permissions: () => [...queryKeys.user.all, 'permissions'],
  },
  
  /**
   * Application-related query keys
   * @namespace queryKeys.app
   */
  app: {
    /** Base key for all app queries */
    all: ['app'],
    
    /** Query key for app configuration */
    config: () => [...queryKeys.app.all, 'config'],
    
    /** Query key for loaded modules */
    modules: () => [...queryKeys.app.all, 'modules'],
    
    /** Query key for app metadata */
    metadata: () => [...queryKeys.app.all, 'metadata'],
  },
  
  /**
   * Legacy support - keeping MENUS for backward compatibility
   * @deprecated Use queryKeys.menu.pages() instead
   */
  MENUS: () => ["MenuList"],
};

export default queryKeys;