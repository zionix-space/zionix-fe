/**
 * @fileoverview React Query Hook for Menu Data
 * 
 * Custom hook for fetching and managing menu data using React Query.
 * Provides automatic caching, refetching, and error handling.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '../../api/menu/menuService';
import { queryKeys } from '../../config/queryKeys';

/**
 * Hook to fetch user's menu permissions
 * 
 * @returns {Object} React Query result object
 * @property {Object|undefined} data - Menu data from API
 * @property {boolean} isLoading - Loading state
 * @property {boolean} isError - Error state
 * @property {Error|null} error - Error object if request failed
 * @property {Function} refetch - Function to manually refetch data
 * 
 * @example
 * ```js
 * const { data: menuData, isLoading, isError } = useMenuQuery();
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage />;
 * 
 * // Use menuData
 * ```
 */
export const useMenuQuery = () => {
    return useQuery({
        queryKey: queryKeys.menu.list(),
        queryFn: menuService.getMenus,
        staleTime: 10 * 60 * 1000, // 10 minutes - menus don't change often
        gcTime: 30 * 60 * 1000, // 30 minutes cache
        refetchOnWindowFocus: false, // Don't refetch on window focus for menus
        retry: 2, // Retry twice on failure
    });
};

export default useMenuQuery;
