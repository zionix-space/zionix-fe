import { useMemo } from "react";

/**
 * Mobile Bottom Navigation Styles - EXACT Fintech Premium Feel
 * Pixel-perfect matching of modern fintech apps
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main navigation container - exact fintech style
    navigationContainerStyle: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(82px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      backgroundColor: token.colorBgContainer,
      borderTop: 'none',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      paddingTop: 12,
      paddingLeft: 0,
      paddingRight: 0,
      zIndex: 1000,
      boxShadow: 'none',
    },

    // Navigation item - exact spacing and sizing
    navItemStyle: {
      flex: '0 0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '0',
      cursor: 'pointer',
      borderRadius: 0,
      transition: 'all 0.15s ease',
      minHeight: '60px',
      minWidth: '70px',
      position: 'relative',
      WebkitTapHighlightColor: 'transparent',
      gap: 6,
    },

    // Icon container - exact sizing
    iconContainerStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      transition: 'all 0.15s ease',
    },

    // Active icon - filled, exact size
    activeIconStyle: {
      fontSize: '24px',
      color: token.colorPrimary,
      transition: 'all 0.15s ease',
      lineHeight: 1,
    },

    // Inactive icon - outline, exact size
    inactiveIconStyle: {
      fontSize: '24px',
      color: '#9CA3AF',
      transition: 'all 0.15s ease',
      lineHeight: 1,
    },

    // Active label - exact font
    activeLabelStyle: {
      fontSize: '11px',
      fontWeight: 600,
      textAlign: 'center',
      lineHeight: 1.2,
      color: token.colorPrimary,
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    },

    // Inactive label - exact font
    inactiveLabelStyle: {
      fontSize: '11px',
      fontWeight: 500,
      textAlign: 'center',
      lineHeight: 1.2,
      color: '#9CA3AF',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    },
  }), [token]);
};
