/**
 * @fileoverview TanStack Query Client Configuration
 * 
 * This file configures the QueryClient instance for TanStack Query with
 * optimized settings for the Zionix platform. It includes proper error handling,
 * retry logic, and caching strategies suitable for a micro-frontend architecture.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Creates and configures a QueryClient instance with platform-optimized settings
 * 
 * @returns {QueryClient} Configured QueryClient instance
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // Keep data in cache for 10 minutes after component unmount
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        
        // Retry failed requests 3 times with exponential backoff
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Refetch on window focus for better UX
        refetchOnWindowFocus: true,
        
        // Don't refetch on reconnect by default (can be overridden per query)
        refetchOnReconnect: 'always',
        
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
        
        // Network mode - fail fast on network errors
        networkMode: 'online',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        
        // Retry delay for mutations
        retryDelay: 1000,
        
        // Network mode for mutations
        networkMode: 'online',
      },
    },
  });
};

/**
 * Global QueryClient instance
 * Use this instance across the application for consistency
 */
export const queryClient = createQueryClient();

export default queryClient;