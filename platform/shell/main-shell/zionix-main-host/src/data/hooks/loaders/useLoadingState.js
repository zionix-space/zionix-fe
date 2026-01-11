import { useState, useCallback } from 'react';

/**
 * Hook for managing component-level loading states
 * Useful for buttons, forms, and async operations
 */
export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = useState(initialState);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const withLoading = useCallback(async (asyncFn) => {
        try {
            startLoading();
            const result = await asyncFn();
            return result;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return {
        isLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
};
