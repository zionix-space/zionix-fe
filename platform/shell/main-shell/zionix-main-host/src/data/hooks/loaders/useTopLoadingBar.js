import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for managing top loading bar state
 * Automatically triggers on route changes
 */
export const useTopLoadingBar = () => {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Start loading on route change
        setIsLoading(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        // Complete loading after a short delay
        const timeout = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        }, 800);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [location.pathname]);

    const startLoading = () => {
        setIsLoading(true);
        setProgress(0);
    };

    const completeLoading = () => {
        setProgress(100);
        setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
        }, 200);
    };

    return { progress, isLoading, startLoading, completeLoading };
};
