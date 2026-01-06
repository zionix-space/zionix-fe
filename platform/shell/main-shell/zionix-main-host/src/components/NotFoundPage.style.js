/**
 * @fileoverview Styles for 404 Not Found Page
 * 
 * Beautiful, modern styling for the 404 page with
 * theme-based colors and smooth animations.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { useMemo } from 'react';

export const useStyles = (token) => {
    return useMemo(
        () => ({
            container: {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: token.colorBgLayout,
                padding: '20px',
                fontFamily: token.fontFamily,
            },

            card: {
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                padding: '60px 80px',
                maxWidth: '900px',
                width: '100%',
                boxShadow: token.boxShadowSecondary,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${token.colorBorderSecondary}`,
            },

            illustrationContainer: {
                position: 'relative',
                height: '300px',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },

            tree1: {
                position: 'absolute',
                left: '10%',
                bottom: '20px',
                opacity: 0.6,
            },

            tree2: {
                position: 'absolute',
                right: '10%',
                bottom: '20px',
                opacity: 0.6,
            },

            treeIcon: {
                fontSize: '80px',
                color: token.colorPrimaryBg,
            },

            cloud1: {
                position: 'absolute',
                top: '20px',
                left: '20%',
                opacity: 0.4,
                animation: 'float 6s ease-in-out infinite',
            },

            cloud2: {
                position: 'absolute',
                top: '40px',
                right: '25%',
                opacity: 0.4,
                animation: 'float 8s ease-in-out infinite',
            },

            cloudIcon: {
                fontSize: '40px',
                color: token.colorPrimaryBorder,
            },

            character: {
                position: 'relative',
                zIndex: 2,
            },

            characterBody: {
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${token.colorPrimaryActive} 0%, ${token.colorPrimary} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 10px 40px ${token.colorPrimaryBg}`,
                animation: 'bounce 2s ease-in-out infinite',
            },

            searchIcon: {
                fontSize: '80px',
                color: token.colorWhite || '#ffffff',
            },

            decorativeElement1: {
                position: 'absolute',
                bottom: '40px',
                left: '25%',
                opacity: 0.5,
                animation: 'float 5s ease-in-out infinite',
            },

            decorativeElement2: {
                position: 'absolute',
                bottom: '60px',
                right: '30%',
                opacity: 0.5,
                animation: 'float 7s ease-in-out infinite',
            },

            leafIcon: {
                fontSize: '30px',
                color: token.colorSuccess,
            },

            content: {
                marginTop: '20px',
            },

            title: {
                fontSize: token.fontSizeHeading2,
                fontWeight: token.fontWeightStrong,
                color: token.colorText,
                marginBottom: '16px',
                lineHeight: token.lineHeightHeading2,
            },

            highlight: {
                color: token.colorPrimary,
                fontWeight: token.fontWeightStrong,
            },

            description: {
                fontSize: token.fontSize,
                color: token.colorTextSecondary,
                marginBottom: '32px',
                display: 'block',
            },

            button: {
                height: '48px',
                padding: '0 40px',
                fontSize: token.fontSize,
                fontWeight: token.fontWeightStrong,
                borderRadius: token.borderRadiusLG,
                background: token.colorPrimary,
                border: 'none',
                boxShadow: `0 4px 12px ${token.colorPrimaryBg}`,
                transition: 'all 0.3s ease',
            },
        }),
        [token]
    );
};

if (typeof document !== 'undefined') {
    const styleId = 'notfound-animations';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes bounce {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }
    `;
        document.head.appendChild(style);
    }
}
