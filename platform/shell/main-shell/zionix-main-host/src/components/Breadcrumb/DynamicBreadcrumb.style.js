import { useMemo } from 'react';

// Ultra-compact breadcrumb styles for SaaS - Maximum content space
export const useStyles = (token) => {
    return useMemo(() => {
        return {
            container: {
                position: 'sticky',
                top: 0,
                zIndex: token.zIndexPopupBase || 100,
                padding: `4px ${token.paddingSM}px`,
                background: 'transparent',
                borderBottom: 'none',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
            },

            item: {
                fontSize: '10px',
                fontWeight: 500,
                color: token.colorTextSecondary,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 0.6,
                letterSpacing: '0',
                padding: `1px 4px`,
                borderRadius: '3px',
                display: 'inline-block',
            },

            itemHovered: {
                fontSize: '10px',
                fontWeight: 500,
                color: token.colorText,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 0.85,
                letterSpacing: '0',
                padding: `1px 4px`,
                borderRadius: '3px',
                display: 'inline-block',
                backgroundColor: token.colorBgTextHover,
            },

            currentItem: {
                fontSize: '10px',
                fontWeight: 600,
                color: token.colorText,
                cursor: 'default',
                opacity: 0.75,
                letterSpacing: '0',
                padding: `1px 4px`,
                borderRadius: '3px',
                display: 'inline-block',
            },

            separator: {
                fontSize: '10px',
                color: token.colorTextQuaternary,
                opacity: 0.4,
                margin: `0 1px`,
                fontWeight: 400,
            },
        };
    }, [token]);
};
