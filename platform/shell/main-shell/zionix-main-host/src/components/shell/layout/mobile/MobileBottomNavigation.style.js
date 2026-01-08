import { useMemo } from 'react';

/**
 * Mobile Bottom Navigation Styles - Native iOS-style bottom tab bar
 * Clean minimal design matching reference with Home, Schedule, Message, Setting
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main container - fixed at bottom with safe area support
    containerStyle: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      height: 'calc(68px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: token.colorBgContainer,
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: `1px solid ${token.colorBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      boxShadow: 'none',
    },

    // Navigation item container
    navItemStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '12px 8px',
      cursor: 'pointer',
      borderRadius: 0,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: 'transparent',
      WebkitTapHighlightColor: 'transparent',
      minWidth: 0,
      position: 'relative',
    },

    // Selected navigation item
    navItemSelectedStyle: {
      backgroundColor: 'transparent',
    },

    // Icon container
    iconContainerStyle: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
    },

    // Icon style - larger and cleaner
    iconStyle: {
      fontSize: 26,
      color: token.colorTextSecondary,
      transition: 'all 0.2s ease',
      lineHeight: 1,
    },

    // Selected icon style - primary color
    iconSelectedStyle: {
      color: token.colorPrimary,
      transform: 'scale(1)',
    },

    // Label style - smaller and cleaner
    labelStyle: {
      fontSize: 12,
      fontWeight: 500,
      color: token.colorTextSecondary,
      transition: 'all 0.2s ease',
      lineHeight: 1.2,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      letterSpacing: '-0.01em',
    },

    // Selected label style
    labelSelectedStyle: {
      color: token.colorPrimary,
      fontWeight: 600,
    },

    // Badge style
    badgeStyle: {
      lineHeight: 1,
    },
  }), [token]);
};

// Animation variants for navigation items
export const navItemVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: custom * 0.05,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};
