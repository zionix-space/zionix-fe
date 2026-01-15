import React, { useEffect, useState, useRef } from 'react';
import { theme } from 'antd';

/**
 * GlobalTopLoader - Shared indeterminate top loader for all microfrontends
 * Fast-flowing linear animation style (not progress-based)
 * Blocks interactions during loading
 * Ensures minimum display time for clear visual feedback
 * 
 * Usage:
 * 1. As Suspense fallback: <Suspense fallback={<GlobalTopLoader />}>
 * 2. As standalone loader: <GlobalTopLoader show={isLoading} />
 */
export const GlobalTopLoader = ({ show = true, minDisplayTime = 300 }) => {
    const { token } = theme.useToken();
    const [isVisible, setIsVisible] = useState(true);
    const mountTimeRef = useRef(Date.now());

    // When used as Suspense fallback, show is always true
    // Component unmounts when Suspense resolves
    useEffect(() => {
        if (!show) {
            // Ensure minimum display time for visual feedback
            const elapsedTime = Date.now() - mountTimeRef.current;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            const timer = setTimeout(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsVisible(false);
                    });
                });
            }, remainingTime);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(true);
            mountTimeRef.current = Date.now();
        }
    }, [show, minDisplayTime]);

    if (!isVisible) return null;

    return (
        <>
            {/* Overlay to block interactions */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: token.colorBgContainer,
                    zIndex: 9998,
                    cursor: 'wait',
                    pointerEvents: 'all',
                }}
            />

            {/* Top Loading Bar - Indeterminate flowing style */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: 'transparent',
                    zIndex: 9999,
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '40%',
                        background: `linear-gradient(90deg, transparent, ${token.colorPrimary}, ${token.colorPrimary}, transparent)`,
                        animation: 'flowLoader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        boxShadow: `0 0 10px ${token.colorPrimary}`,
                    }}
                />
            </div>

            <style>{`
                @keyframes flowLoader {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(350%);
                    }
                }
            `}</style>
        </>
    );
};

/**
 * MicrofrontendLoader - Wrapper for microfrontend bootstrap
 * Handles initial loading state for hard refreshes
 * Shows fast-flowing top loader until app is ready
 * Ensures minimum display time for visual feedback
 */
export const MicrofrontendLoader = ({ children, appName = 'App', minDisplayTime = 400 }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const { token } = theme.useToken();
    const mountTimeRef = React.useRef(Date.now());

    React.useEffect(() => {
        // Wait for critical resources and DOM to be ready
        const handleLoad = () => {
            // Ensure minimum display time
            const elapsedTime = Date.now() - mountTimeRef.current;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                // Use requestAnimationFrame to sync with browser paint
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        setIsLoading(false);
                    });
                });
            }, remainingTime);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Also listen for DOMContentLoaded as fallback
            document.addEventListener('DOMContentLoaded', handleLoad);
            return () => {
                window.removeEventListener('load', handleLoad);
                document.removeEventListener('DOMContentLoaded', handleLoad);
            };
        }
    }, [minDisplayTime]);

    if (isLoading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: token.colorBgContainer,
                    zIndex: 99999,
                }}
            >
                {/* Top Loading Bar - Indeterminate flowing style */}
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '40%',
                            background: `linear-gradient(90deg, transparent, ${token.colorPrimary}, ${token.colorPrimary}, transparent)`,
                            animation: 'flowLoader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                            boxShadow: `0 0 10px ${token.colorPrimary}`,
                        }}
                    />
                </div>
                <style>{`
                    @keyframes flowLoader {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(350%);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return children;
};

export default GlobalTopLoader;
