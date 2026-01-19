import { useMemo } from 'react';

// Premium Apple-style breadcrumb styles
export const useStyles = (token) => {
    return useMemo(() => {
        // Detect dark mode
        const isDarkMode =
            token.colorBgBase === '#000000' ||
            token.colorBgContainer === '#141414' ||
            token.colorBgElevated === '#1f1f1f' ||
            (token.colorBgContainer &&
                token.colorBgContainer.startsWith('#') &&
                parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

        return {
            container: {
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '10px 13px',
                background: isDarkMode
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            },

            item: {
                fontSize: '12px',
                fontWeight: 500,
                color: token.colorTextSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.6,
                letterSpacing: '-0.01em',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-block',
            },

            itemHovered: {
                fontSize: '12px',
                fontWeight: 500,
                color: token.colorText,
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 1,
                letterSpacing: '-0.01em',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-block',
                backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)',
            },

            currentItem: {
                fontSize: '12px',
                fontWeight: 600,
                color: token.colorText,
                cursor: 'default',
                opacity: 0.85,
                letterSpacing: '-0.01em',
                padding: '2px 6px',
                borderRadius: '4px',
                display: 'inline-block',
            },

            separator: {
                fontSize: '14px',
                color: token.colorTextQuaternary,
                opacity: 0.35,
                margin: '0 2px',
                fontWeight: 300,
            },
        };
    }, [token]);
};
