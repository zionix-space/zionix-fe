import { useMemo } from 'react';

/**
 * Mobile Header Styles - Premium Apple-style native iOS header
 * Unified glassmorphism design with rich native feel
 */
export const useStyles = (token) => {
  return useMemo(
    () => ({
      // Main header container - Same background as content (colorBgLayout)
      headerStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        height: 'calc(64px + env(safe-area-inset-top))',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 12,
        backgroundColor: token.colorBgLayout,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: 'none',
      },

      // Account container - Premium card-like design
      accountContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        padding: '6px 12px 6px 6px',
        borderRadius: 20,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: `${token.colorFillQuaternary}40`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        WebkitTapHighlightColor: 'transparent',
        border: `1px solid ${token.colorBorder}20`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },

      // Avatar - Premium styling with gradient
      avatarStyle: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        backgroundColor: token.colorPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorWhite,
        fontSize: 16,
        fontWeight: 600,
        flexShrink: 0,
        boxShadow: `0 2px 8px ${token.colorPrimary}40`,
        border: `2px solid ${token.colorBgContainer}`,
      },

      // Account text container
      accountTextContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      },

      // Account text - Premium typography
      accountTextStyle: {
        fontSize: 15,
        fontWeight: 600,
        color: token.colorText,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },

      // Dropdown icon - Premium styling
      dropdownIconStyle: {
        fontSize: 16,
        color: token.colorTextSecondary,
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        lineHeight: 1,
      },

      // Theme switcher container - Premium Apple capsule
      themeContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: 4,
        borderRadius: 20,
        backgroundColor: `${token.colorFillQuaternary}40`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${token.colorBorder}20`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },

      // Theme button - iOS style
      themeButtonStyle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'transparent',
        border: 'none',
        WebkitTapHighlightColor: 'transparent',
      },

      // Active theme button
      themeButtonActiveStyle: {
        backgroundColor: token.colorBgContainer,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },

      // Theme icon
      themeIconStyle: {
        fontSize: 16,
        color: token.colorTextSecondary,
        transition: 'all 0.2s ease',
      },

      // Active theme icon
      themeIconActiveStyle: {
        color: token.colorPrimary,
      },

      // Color picker container - Premium Apple capsule
      colorPickerContainerStyle: {
        display: 'flex',
        alignItems: 'center',
        padding: 4,
        borderRadius: 20,
        backgroundColor: `${token.colorFillQuaternary}40`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${token.colorBorder}20`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },

      // Color picker button
      colorPickerButtonStyle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'transparent',
        border: 'none',
        WebkitTapHighlightColor: 'transparent',
      },

      // Color picker icon
      colorPickerIconStyle: {
        fontSize: 18,
        color: token.colorTextSecondary,
        transition: 'all 0.2s ease',
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
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Inject CSS for active effects
export const injectHeaderCSS = (token) => {
  const styleId = 'mobile-header-styles';

  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Mobile Header Account Container Active Effects */
    .mobile-header-account:active {
      transform: scale(0.97);
      background-color: ${token.colorFillQuaternary}60 !important;
    }

    /* Dark mode adjustments */
    [data-theme="dark"] .mobile-header-account {
      background-color: ${token.colorFillQuaternary}30 !important;
      border: 1px solid ${token.colorBorder}15 !important;
    }

    [data-theme="dark"] .mobile-header-account:active {
      background-color: ${token.colorFillQuaternary}50 !important;
    }
  `;
  document.head.appendChild(style);
};
