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
      ease: "easeOut",
    },
  },
};

/**
 * Animation variants for the profile dropdown
 */
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Custom hook for mobile profile dropdown styles using design tokens
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
    zIndex: 1060, // Higher than search popup
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 0,
  },

  // Backdrop
  backdropStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: -1,
  },

  // Main dropdown container
  dropdownStyle: {
    position: 'absolute',
    top: '60px', // Below mobile header
    left: token.paddingMD,
    width: '280px',
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadius,
    boxShadow: `0 8px 24px ${token.colorBgMask}`,
    border: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'hidden',
    zIndex: 1,
  },

  // Profile header section
  profileHeaderStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: `${token.paddingMD}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
  },

  // Avatar container
  avatarContainerStyle: {
    position: 'relative',
    marginRight: token.paddingSM,
    flexShrink: 0,
  },

  // Avatar image
  avatarImageStyle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `2px solid ${token.colorBorder}`,
    objectFit: 'cover',
  },

  // Avatar fallback
  avatarFallbackStyle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: token.colorPrimary,
    color: token.colorWhite,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: token.fontSizeLG,
    fontWeight: 600,
    border: `2px solid ${token.colorBorder}`,
  },

  // Profile info container
  profileInfoStyle: {
    flex: 1,
    minWidth: 0, // Allow text truncation
  },

  // Profile name
  profileNameStyle: {
    fontSize: token.fontSize,
    fontWeight: 600,
    color: token.colorText,
    lineHeight: 1.4,
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Profile email
  profileEmailStyle: {
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Menu container
  menuContainerStyle: {
    padding: `${token.paddingXS}px 0`,
  },

  // Menu item
  menuItemStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: `${token.paddingSM}px ${token.paddingMD}px`,
    cursor: 'pointer',
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    userSelect: 'none',
    '&:hover': {
      backgroundColor: token.colorFillSecondary,
    },
    '&:active': {
      backgroundColor: token.colorFillTertiary,
    },
  },

  // Menu item icon
  menuItemIconStyle: {
    fontSize: '16px',
    color: token.colorTextSecondary,
    marginRight: token.paddingSM,
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Menu item label
  menuItemLabelStyle: {
    fontSize: token.fontSize,
    color: token.colorText,
    lineHeight: 1.4,
    flex: 1,
  },

  // Divider
  dividerStyle: {
    height: '1px',
    backgroundColor: token.colorBorderSecondary,
    margin: `${token.paddingXS}px ${token.paddingMD}px`,
  },
}), [token]);