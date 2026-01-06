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

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

/**
 * Creates and configures a QueryClient instance with platform-optimized settings
 * 
 * @returns {QueryClient} Configured QueryClient instance
 */
export const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Query Error:', {
            queryKey: query.queryKey,
            error,
          });
        }

        // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
        // Example: logErrorToService(error, { queryKey: query.queryKey });
      },
    }),

    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // Log mutation errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Mutation Error:', {
            mutationKey: mutation.options.mutationKey,
            error,
          });
        }

        // TODO: Send to monitoring service
      },
    }),

    defaultOptions: {
      queries: {
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Keep data in cache for 10 minutes after component unmount
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

        // Smart retry logic based on error type
        retry: (failureCount, error) => {
          // Don't retry if request was cancelled
          if (error?.cancelled) {
            return false;
          }

          // Don't retry on 4xx errors (client errors)
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

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus for better UX
        refetchOnWindowFocus: true,

        // Refetch on reconnect
        refetchOnReconnect: 'always',

        // Don't refetch on mount if data is fresh
        refetchOnMount: true,

        // Network mode - fail fast on network errors
        networkMode: 'online',

        // Throw errors to error boundaries
        useErrorBoundary: (error) => {
          // Use error boundary for server errors (5xx)
          return error?.isServerError || false;
        },
      },
      mutations: {
        // Retry mutations once on failure (only for network errors)
        retry: (failureCount, error) => {
          // Only retry network errors, not client/server errors
          if (error?.isNetworkError && failureCount < 1) {
            return true;
          }
          return false;
        },

        // Retry delay for mutations
        retryDelay: 1000,

        // Network mode for mutations
        networkMode: 'online',

        // Throw mutation errors to error boundaries for server errors
        useErrorBoundary: (error) => {
          return error?.isServerError || false;
        },
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