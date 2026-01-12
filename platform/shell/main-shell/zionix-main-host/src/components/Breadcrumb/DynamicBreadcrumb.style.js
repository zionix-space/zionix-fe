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
                padding: '16px 24px',
                background: 'transparent',
                borderBottom: `1px solid ${token.colorBorderSecondary}20`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            },

            item: {
                fontSize: '13px',
                fontWeight: 500,
                color: token.colorTextSecondary,
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.65,
                letterSpacing: '-0.01em',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-block',
                willChange: 'opacity, background-color, color',
            },

            itemHovered: {
                fontSize: '13px',
                fontWeight: 500,
                color: token.colorText,
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 1,
                letterSpacing: '-0.01em',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-block',
                backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)',
                willChange: 'opacity, background-color, color',
            },

            currentItem: {
                fontSize: '13px',
                fontWeight: 600,
                color: token.colorText,
                cursor: 'default',
                opacity: 0.9,
                letterSpacing: '-0.01em',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'inline-block',
            },

            separator: {
                fontSize: '16px',
                color: token.colorTextQuaternary,
                opacity: 0.4,
                margin: '0 2px',
                fontWeight: 400,
            },
        };
    }, [token]);
};
