import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for managing top loading bar state
 * Ensures loader is visible for minimum duration for clear visual feedback
 * Then waits for content to be painted before hiding
 */
export const useTopLoadingBar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const loadingStartTimeRef = useRef(null);
    const loadingTimeoutRef = useRef(null);

    useEffect(() => {
        // Start loading immediately on route change
        setIsLoading(true);
        loadingStartTimeRef.current = Date.now();

        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
        }

        // Minimum display time for visual feedback (400ms)
        const MIN_LOADING_TIME = 400;

        // Use double requestAnimationFrame to ensure content is painted
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Calculate how long loader has been visible
                const elapsedTime = Date.now() - loadingStartTimeRef.current;
                const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

                // Wait for minimum time + ensure content is painted
                loadingTimeoutRef.current = setTimeout(() => {
                    setIsLoading(false);
                }, remainingTime);
            });
        });

        return () => {
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, [location.pathname, location.search, location.hash]);

    const startLoading = useCallback(() => {
        setIsLoading(true);
        loadingStartTimeRef.current = Date.now();
    }, []);

    const completeLoading = useCallback(() => {
        // Ensure minimum display time
        const MIN_LOADING_TIME = 400;
        const elapsedTime = Date.now() - (loadingStartTimeRef.current || Date.now());
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        setTimeout(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsLoading(false);
                });
            });
        }, remainingTime);
    }, []);

    return { isLoading, startLoading, completeLoading };
};
