import { useMemo } from 'react';

// Premium ultra-compact breadcrumb with Apple/Google/Microsoft SaaS approach
// Uses proper design system tokens for full theme support
export const useStyles = (token) => {
    return useMemo(() => {
        // Use design system tokens for proper dark/light theme support
        const glassBackground = `linear-gradient(180deg, 
            ${token.colorBgContainer}f0 0%, 
            ${token.colorBgContainer}e6 100%)`;

        return {
            container: {
                position: 'sticky',
                top: 0,
                zIndex: token.zIndexPopupBase || 100,
                padding: '0px 13px',
                paddingTop: '4px',
                paddingBottom: '4px',
                marginBottom: '0px',
                background: glassBackground,
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderTopLeftRadius: '30px',
                boxShadow: `0 1px 3px ${token.colorBgSpotlight}`,
                overflow: 'hidden', // Prevent horizontal scroll
                maxWidth: '100%', // Ensure it doesn't exceed container
            },

            item: {
                fontSize: '10px',
                fontWeight: 500,
                color: token.colorTextSecondary,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 0.7,
                letterSpacing: '0.01em',
                padding: '1px 4px',
                borderRadius: token.borderRadiusSM,
                display: 'inline-block',
                whiteSpace: 'nowrap', // Prevent text wrapping
                lineHeight: '1.4',
            },

            itemHovered: {
                fontSize: '10px',
                fontWeight: 500,
                color: token.colorText,
                cursor: 'pointer',
                transition: `all ${token.motionDurationFast} ${token.motionEaseInOut}`,
                opacity: 1,
                letterSpacing: '0.01em',
                padding: '1px 4px',
                borderRadius: token.borderRadiusSM,
                display: 'inline-block',
                backgroundColor: token.colorBgTextHover,
                whiteSpace: 'nowrap',
                lineHeight: '1.4',
            },

            currentItem: {
                fontSize: '10px',
                fontWeight: 600,
                color: token.colorText,
                cursor: 'default',
                opacity: 0.9,
                letterSpacing: '0.01em',
                padding: '1px 4px',
                borderRadius: token.borderRadiusSM,
                display: 'inline-block',
                whiteSpace: 'nowrap',
                lineHeight: '1.4',
            },

            separator: {
                fontSize: '9px',
                color: token.colorTextQuaternary,
                opacity: 0.5,
                margin: '0 1px',
                fontWeight: 400,
            },
        };
    }, [token]);
};
