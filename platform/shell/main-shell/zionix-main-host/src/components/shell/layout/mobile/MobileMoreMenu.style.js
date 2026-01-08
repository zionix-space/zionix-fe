/**
 * Mobile More Menu Styles - Premium Apple Glassmorphism
 * Native iOS slide-up menu with rich frosted glass effect
 */

export const useStyles = (token) => ({
  // Backdrop overlay - Minimal blur for readability
  backdropStyle: {
    position: 'fixed',
    top: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 1999,
  },

  // Main menu container - Premium Apple glassmorphism
  menuContainerStyle: {
    position: 'fixed',
    bottom: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    backgroundColor: `${token?.colorBgElevated}F2`,
    backdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(1.05)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    zIndex: 2000,
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: `
      0 -12px 48px rgba(0, 0, 0, 0.12),
      0 -6px 24px rgba(0, 0, 0, 0.08),
      0 -2px 12px rgba(0, 0, 0, 0.04),
      inset 0 0 0 1px ${token?.colorBgElevated}80,
      inset 0 1px 0 0 rgba(255, 255, 255, 0.8)
    `,
    border: `0.5px solid ${token?.colorBorder}99`,
  },

  // Handle bar container
  handleBarContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0 12px',
  },

  // Handle bar - iOS style
  handleBarStyle: {
    width: '40px',
    height: '5px',
    backgroundColor: token?.colorTextQuaternary,
    borderRadius: token?.borderRadiusSM,
    cursor: 'pointer',
    opacity: 0.4,
  },

  // Header container
  headerContainerStyle: {
    padding: '0 24px 20px',
    borderBottom: `0.5px solid ${token?.colorBorder}40`,
  },

  // Header title - iOS style with premium color
  headerTitleStyle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: `${token?.colorText}F0`,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    letterSpacing: '-0.03em',
    opacity: 0.95,
  },

  // Content container
  contentContainerStyle: {
    padding: '0 0 40px',
    maxHeight: 'calc(90vh - 140px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  },

  // Menu styling
  menuStyle: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '17px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
  },

  // Expand icon styling
  expandIconStyle: {
    fontSize: '18px',
    color: token?.colorTextTertiary,
  },

  // Safe area padding
  safeAreaStyle: {
    height: 'env(safe-area-inset-bottom, 0px)',
    backgroundColor: `${token?.colorBgElevated}F2`,
    minHeight: '20px',
  },
});

// Generate dynamic CSS for menu items - Premium iOS style
export const generateMenuItemCSS = (token) => `
  /* Dark mode glassmorphism */
  [data-theme="dark"] .mobile-more-menu-container-wrapper {
    background: ${token?.colorBgElevated}E5 !important;
    backdrop-filter: blur(60px) saturate(180%) brightness(0.95) !important;
    -webkit-backdrop-filter: blur(60px) saturate(180%) brightness(0.95) !important;
    border: 0.5px solid ${token?.colorBorder}2E !important;
    box-shadow: 
      0 -12px 48px rgba(0, 0, 0, 0.4),
      0 -6px 24px rgba(0, 0, 0, 0.3),
      0 -2px 12px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px ${token?.colorBgElevated}14,
      inset 0 1px 0 0 rgba(255, 255, 255, 0.12) !important;
  }

  /* Theme-based scrollbar styling */
  .mobile-more-menu-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-thumb {
    background-color: ${token?.colorText}10;
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-thumb:hover {
    background-color: ${token?.colorText}20;
  }
  
  /* Firefox scrollbar styling */
  .mobile-more-menu-container {
    scrollbar-width: thin;
    scrollbar-color: ${token?.colorText}10 transparent;
  }
  
  /* Menu items - Clean iOS style with premium Apple colors */
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title {
    height: 56px !important;
    line-height: 56px !important;
    padding: 0 24px !important;
    margin: 0 !important;
    border-bottom: 0.5px solid ${token?.colorBorder}30 !important;
    font-size: 17px !important;
    font-weight: 500 !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
    letter-spacing: -0.01em !important;
    border-radius: 0 !important;
    color: ${token?.colorText}E6 !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    background: transparent !important;
    opacity: 0.95 !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item:last-child,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu:last-child .ant-menu-submenu-title {
    border-bottom: none !important;
  }
  
  /* Active/tap state */
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item:active,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title:active {
    background: rgba(0, 0, 0, 0.04) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
  }
  
  [data-theme="dark"] .mobile-more-menu-container .ant-menu-inline .ant-menu-item:active,
  [data-theme="dark"] .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title:active {
    background: rgba(255, 255, 255, 0.08) !important;
  }
  
  /* Selected state */
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected {
    background-color: ${token?.colorPrimaryBg} !important;
    color: ${token?.colorPrimary} !important;
    font-weight: 600 !important;
  }
  
  /* Icons - Premium Apple style with better visibility */
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item .anticon,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title .anticon,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item i,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title i {
    font-size: 22px !important;
    margin-right: 16px !important;
    color: ${token?.colorTextSecondary}CC !important;
    opacity: 0.85 !important;
    transition: all 0.2s ease !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected .anticon,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected i {
    color: ${token?.colorPrimary} !important;
    opacity: 1 !important;
  }
  
  /* Submenu arrow - Premium Apple style */
  .mobile-more-menu-container .ant-menu-submenu-arrow {
    color: ${token?.colorTextTertiary}99 !important;
    opacity: 0.5 !important;
    transition: all 0.2s ease !important;
  }
  
  /* Badge styling */
  .mobile-more-menu-container .ant-badge {
    margin-left: auto !important;
  }
`;

// Animation variants for framer-motion
export const backdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export const menuVariants = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  },
  exit: {
    y: "100%",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300
    }
  }
};

export const handleBarVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, duration: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.1 }
  }
};

export const headerVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, duration: 0.3 }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};
