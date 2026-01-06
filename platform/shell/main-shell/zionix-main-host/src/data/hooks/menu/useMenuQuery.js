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
 * const { data: menuData, isLoading, isError, error } = useMenuQuery();
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <ErrorMessage error={error} />;
 * 
 * // Use menuData
 * ```
 */
export const useMenuQuery = () => {
    return useQuery({
        queryKey: queryKeys.menu.list(),
        queryFn: async ({ signal }) => {
            // Pass abort signal for request cancellation
            const response = await menuService.getMenus({ signal });
            return response;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes - menus don't change often
        gcTime: 30 * 60 * 1000, // 30 minutes cache
        refetchOnWindowFocus: false, // Don't refetch on window focus for menus
        refetchOnReconnect: true, // Refetch when network reconnects

        // Smart retry logic based on error type
        retry: (failureCount, error) => {
            // Don't retry if request was cancelled
            if (error?.cancelled) {
                return false;
            }

            // Don't retry on 4xx errors (client errors like 400, 403, 404)
            if (error?.isClientError) {
                return false;
            }

            // Don't retry on rate limiting
            if (error?.status === 429) {
                return false;
            }

            // Retry up to 3 times for server errors and network issues
            return failureCount < 3;
        },

        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Network mode - fail fast on offline
        networkMode: 'online',
    });
};

export default useMenuQuery;
