import { useMemo } from 'react';

// Premium Apple-style breadcrumb styles with full theme support
export const useStyles = (token) => {
    return useMemo(() => {
        return {
            container: {
                position: 'sticky',
                top: 0,
                zIndex: token.zIndexPopupBase || 100,
                padding: `6px ${token.paddingSM}px`,
                background: 'transparent',
                borderBottom: 'none',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
            },

            item: {
                fontSize: '11px',
                fontWeight: 500,
                color: token.colorTextSecondary,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 0.6,
                letterSpacing: '0',
                padding: `2px 6px`,
                borderRadius: '4px',
                display: 'inline-block',
            },

            itemHovered: {
                fontSize: '11px',
                fontWeight: 500,
                color: token.colorText,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 0.85,
                letterSpacing: '0',
                padding: `2px 6px`,
                borderRadius: '4px',
                display: 'inline-block',
                backgroundColor: token.colorBgTextHover,
            },

            currentItem: {
                fontSize: '11px',
                fontWeight: 600,
                color: token.colorText,
                cursor: 'default',
                opacity: 0.75,
                letterSpacing: '0',
                padding: `2px 6px`,
                borderRadius: '4px',
                display: 'inline-block',
            },

            separator: {
                fontSize: '12px',
                color: token.colorTextQuaternary,
                opacity: 0.4,
                margin: `0 2px`,
                fontWeight: 400,
            },
        };
    }, [token]);
};
