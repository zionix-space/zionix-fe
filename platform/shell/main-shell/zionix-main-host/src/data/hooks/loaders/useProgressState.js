import { useState, useCallback } from 'react';

/**
 * Hook for managing progress state
 * Useful for file uploads, data processing, multi-step operations
 */
export const useProgressState = (initialProgress = 0) => {
    const [progress, setProgress] = useState(initialProgress);
    const [status, setStatus] = useState('active'); // active, success, exception

    const updateProgress = useCallback((value) => {
        setProgress(value);
        if (value >= 100) {
            setStatus('success');
        }
    }, []);

    const incrementProgress = useCallback((increment = 10) => {
        setProgress((prev) => {
            const newProgress = Math.min(prev + increment, 100);
            if (newProgress >= 100) {
                setStatus('success');
            }
            return newProgress;
        });
    }, []);

    const resetProgress = useCallback(() => {
        setProgress(0);
        setStatus('active');
    }, []);

    const setError = useCallback(() => {
        setStatus('exception');
    }, []);

    const setSuccess = useCallback(() => {
        setProgress(100);
        setStatus('success');
    }, []);

    return {
        progress,
        status,
        updateProgress,
        incrementProgress,
        resetProgress,
        setError,
        setSuccess,
    };
};
