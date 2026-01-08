import { useMemo } from "react";

/**
 * Animation variants for the backdrop
 */
export const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Animation variants for the profile dropdown
 */
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Custom hook for mobile profile dropdown styles using design tokens
 * Premium Apple-style native iOS dropdown with proper mobile sizing
 * @param {Object} token - Design system tokens
 * @returns {Object} Styled components object
 */
export const useStyles = (token) => useMemo(() => ({
  // Overlay container
  overlayStyle: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1060,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
  },

  // Backdrop - Minimal blur for native feel
  backdropStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: -1,
  },

  // Main dropdown container - Premium Apple glassmorphism matching desktop
  dropdownStyle: {
    position: 'absolute',
    top: 'calc(64px + env(safe-area-inset-top) + 4px)',
    left: 12,
    width: 'calc(100% - 24px)',
    maxWidth: 360,
    backgroundColor: `${token.colorBgElevated}F2`,
    backdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
    borderRadius: 18,
    boxShadow: `
      0 12px 48px rgba(0, 0, 0, 0.12),
      0 6px 24px rgba(0, 0, 0, 0.08),
      0 2px 12px rgba(0, 0, 0, 0.04),
      inset 0 0 0 1px ${token.colorBgElevated}80,
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8)
    `,
    border: `0.5px solid ${token.colorBorder}99`,
    overflow: 'hidden',
    zIndex: 1,
  },

  // Profile header section - Compact mobile design
  profileHeaderStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    borderBottom: `0.5px solid ${token.colorBorder}30`,
    backgroundColor: 'transparent',
  },

  // Avatar container
  avatarContainerStyle: {
    position: 'relative',
    marginRight: 12,
    flexShrink: 0,
  },

  // Avatar image - Mobile optimized size
  avatarImageStyle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: `2px solid ${token.colorBorder}40`,
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  // Avatar fallback - Mobile optimized size
  avatarFallbackStyle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: token.colorPrimary,
    color: token.colorWhite,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 600,
    border: `2px solid ${token.colorBorder}40`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  // Profile info container
  profileInfoStyle: {
    flex: 1,
    minWidth: 0,
  },

  // Profile name - Mobile native typography
  profileNameStyle: {
    fontSize: 16,
    fontWeight: 600,
    color: token.colorText,
    lineHeight: 1.3,
    marginBottom: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.02em',
  },

  // Profile email - Mobile native typography
  profileEmailStyle: {
    fontSize: 13,
    color: token.colorTextSecondary,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.01em',
  },

  // Menu container - Compact mobile spacing
  menuContainerStyle: {
    padding: '6px 0',
  },

  // Menu item - Mobile native sizing
  menuItemStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'transparent',
    borderRadius: 0,
    position: 'relative',
    minHeight: 44, // iOS minimum touch target
  },

  // Menu item icon - Mobile optimized
  menuItemIconStyle: {
    fontSize: 18,
    color: token.colorTextSecondary,
    marginRight: 12,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },

  // Menu item label - Mobile native typography
  menuItemLabelStyle: {
    fontSize: 15,
    fontWeight: 500,
    color: token.colorText,
    lineHeight: 1.4,
    flex: 1,
    letterSpacing: '-0.01em',
  },

  // Divider - Subtle native style
  dividerStyle: {
    height: 0.5,
    backgroundColor: `${token.colorBorder}30`,
    margin: '6px 16px',
  },
}), [token]);

// Add CSS for active effects and dark mode glassmorphism
export const injectProfileDropdownCSS = (token) => {
  const styleId = 'mobile-profile-dropdown-styles';

  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Dark mode glassmorphism for mobile profile dropdown */
    [data-theme="dark"] .mobile-profile-dropdown {
      background: ${token.colorBgElevated}E5 !important;
      backdrop-filter: blur(60px) saturate(180%) brightness(0.95) !important;
      -webkit-backdrop-filter: blur(60px) saturate(180%) brightness(0.95) !important;
      border: 0.5px solid ${token.colorBorder}2E !important;
      box-shadow: 
        0 12px 48px rgba(0, 0, 0, 0.4),
        0 6px 24px rgba(0, 0, 0, 0.3),
        0 2px 12px rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px ${token.colorBgElevated}14,
        inset 0 1px 0 0 rgba(255, 255, 255, 0.12) !important;
    }

    /* Mobile Profile Dropdown Menu Item Active Effects */
    .mobile-profile-menu-item:active {
      background: rgba(0, 0, 0, 0.06) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      transform: scale(0.99) !important;
    }

    .mobile-profile-menu-item:active .mobile-profile-menu-icon {
      color: ${token.colorPrimary} !important;
      transform: scale(1.08) !important;
    }

    /* Dark mode adjustments */
    [data-theme="dark"] .mobile-profile-menu-item:active {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
};
