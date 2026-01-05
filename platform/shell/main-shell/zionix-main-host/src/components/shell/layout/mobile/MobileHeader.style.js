import { useMemo } from 'react';

/**
 * Mobile Header Styles - EXACT Fintech Premium Feel
 * Pixel-perfect matching of modern fintech apps
 */
export const useStyles = (token) => {
  return useMemo(
    () => ({
      // Main header container - exact fintech style
      headerStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        height: 'calc(72px + env(safe-area-inset-top))',
        paddingTop: 'calc(20px + env(safe-area-inset-top))',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 16,
        backgroundColor: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxShadow: 'none',
        borderBottom: 'none',
      },

      // Account container - exact spacing
      accountContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        padding: 0,
        borderRadius: 0,
        transition: 'opacity 0.15s ease',
        backgroundColor: 'transparent',
        WebkitTapHighlightColor: 'transparent',
      },

      // Avatar - exact size
      avatarStyle: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        backgroundColor: token.colorPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorWhite,
        fontSize: 18,
        fontWeight: 600,
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },

      // Account text container
      accountTextContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      },

      // Account text - exact font
      accountTextStyle: {
        fontSize: 17,
        fontWeight: 600,
        color: '#1F2937',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },

      // Dropdown icon - exact size
      dropdownIconStyle: {
        fontSize: 20,
        color: '#6B7280',
        transition: 'transform 0.15s ease',
        lineHeight: 1,
      },
    }),
    [token]
  );
};

// Animation variants
export const headerVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
