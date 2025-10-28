import { useMemo } from 'react';

/**
 * Mobile Header Styles
 * Provides styling for the mobile header component with three sections:
 * - Left: Avatar profile details
 * - Center: Action icons (notification, search, settings)
 * - Right: Theme toggle
 */
export const useStyles = (token) => {
  return useMemo(
    () => ({
      // Main header container
      headerStyle: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        height: 56,
        backgroundColor: token.colorBgContainer,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${token.paddingSM}px`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: token.boxShadowTertiary,
      },

      // Left section - Compact Avatar Only
      leftSectionStyle: {
        display: 'flex',
        alignItems: 'center',
        flex: '0 0 auto',
        minWidth: 48,
        cursor: 'pointer',
      },

      // Center section - Action Icons with better spacing
      centerSectionStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 auto',
        gap: 0, // Compact spacing between icons
      },

      // Right section - Theme switch only
      rightSectionStyle: {
        display: 'flex',
        alignItems: 'center',
        flex: '0 0 auto',
        minWidth: 48,
      },

      // Avatar Profile Styles
      avatarProfileStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: token.paddingSM,
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        borderRadius: token.borderRadiusLG,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
      },

      avatarStyle: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: token.colorPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorWhite,
        fontSize: token.fontSizeSM,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: `0 2px 8px ${token.colorPrimary}20`,
        },
      },

      profileDetailsStyle: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.2,
      },

      userNameStyle: {
        fontSize: token.fontSizeSM,
        fontWeight: 500,
        color: token.colorText,
        margin: 0,
      },

      userRoleStyle: {
        fontSize: token.fontSizeXS,
        color: token.colorTextSecondary,
        margin: 0,
      },

      // Action Icons Styles
      actionIconStyle: {
        width: 48,
        height: 48,
        borderRadius: token.borderRadiusLG,
        border: 'none',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: token.colorText,
        fontSize: 20,
        position: 'relative',
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
      },

      notificationIconStyle: {
        position: 'relative',
      },

      notificationBadgeStyle: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#ff4d4f', // Red color for visibility
        border: `2px solid ${token.colorBgContainer}`,
        display: 'block', // Ensure it's always visible
      },
    }),
    [token]
  );
};

// Animation variants for framer-motion
export const headerVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

export const avatarVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const centerIconsVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
};

export const themeToggleVariants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};
