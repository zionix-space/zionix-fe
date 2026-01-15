import { theme } from 'antd';
import { useState, useEffect } from 'react';
import { useTopLoadingBar } from '../../../data/hooks/loaders/useTopLoadingBar';
import { useMenuQuery } from '../../../data/hooks/menu/useMenuQuery';
import { useStyles } from './TopLoadingBar.style';

/**
 * Top Loading Bar - Indeterminate flowing loader at viewport top
 * Fast linear motion style, blocks interactions during loading
 * Automatically hides when there's a menu query error
 * 
 * NOTE: This loader is for route transitions within the app.
 * It coordinates with GlobalTopLoader to prevent duplicate loaders.
 */
const TopLoadingBar = () => {
    const { isLoading } = useTopLoadingBar();
    const { isError: isMenuError } = useMenuQuery();
    const { token } = theme.useToken();
    const styles = useStyles(token);
    const [showOverlay, setShowOverlay] = useState(false);

    // Show overlay after a brief delay to avoid flashing on quick transitions
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => setShowOverlay(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowOverlay(false);
        }
    }, [isLoading]);

    // Don't show loader if there's a menu error
    if (!isLoading || isMenuError) return null;

    return (
        <>
            {/* Interaction blocker overlay - only visible during loading */}
            {showOverlay && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9998,
                        cursor: 'wait',
                        pointerEvents: 'all',
                        backgroundColor: 'transparent',
                    }}
                />
            )}

            {/* Top Loading Bar - Indeterminate flowing style */}
            <div style={styles.container}>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '40%',
                        background: `linear-gradient(90deg, transparent, ${token.colorPrimary}, ${token.colorPrimary}, transparent)`,
                        animation: 'topFlowLoader 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                        boxShadow: `0 0 10px ${token.colorPrimary}`,
                    }}
                />
            </div>

            <style>{`
                @keyframes topFlowLoader {
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

export default TopLoadingBar;
