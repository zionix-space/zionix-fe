import React, { useState, useEffect } from 'react';
import { useTheme } from '@zionix-space/design-system';

/**
 * SuspenseLoader - Indeterminate top edge loader for React.Suspense
 * Fast-flowing linear motion style
 * Blocks all interactions during loading
 */
export const SuspenseLoader = () => {
    const { token } = useTheme();

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
                        animation: 'suspenseFlowLoader 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        boxShadow: `0 0 10px ${token.colorPrimary}`,
                    }}
                />
            </div>

            <style>{`
                @keyframes suspenseFlowLoader {
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
