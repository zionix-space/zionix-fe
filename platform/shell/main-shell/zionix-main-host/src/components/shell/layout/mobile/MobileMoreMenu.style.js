/**
 * Mobile More Menu Styles - Following desktop pattern with CSS-in-JS
 * Uses design system tokens and RTL-aware properties
 */

export const useStyles = (token) => ({
  // Backdrop overlay
  backdropStyle: {
    position: 'fixed',
    top: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    bottom: 0,
    backgroundColor: token?.colorBgMask,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 1999,
  },

  // Main menu container
  menuContainerStyle: {
    position: 'fixed',
    bottom: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    backgroundColor: token?.colorBgElevated,
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    zIndex: 2000,
    maxHeight: '75vh',
    overflow: 'hidden',
    boxShadow: '0 -10px 50px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${token?.colorBorder}`,
  },

  // Handle bar container
  handleBarContainerStyle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0 12px',
  },

  // Handle bar
  handleBarStyle: {
    width: '40px',
    height: '5px',
    backgroundColor: token?.colorTextQuaternary,
    borderRadius: token?.borderRadiusSM,
    cursor: 'pointer',
  },

  // Header container
  headerContainerStyle: {
    padding: '0 24px 24px',
    borderBottom: `0.5px solid ${token?.colorBorder}`,
  },

  // Header title
  headerTitleStyle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '700',
    color: token?.colorText,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    letterSpacing: '-0.02em',
  },

  // Content container
  contentContainerStyle: {
    padding: '0 0 40px',
    maxHeight: 'calc(75vh - 160px)',
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
    backgroundColor: token?.colorBgElevated,
    minHeight: '20px',
  },
});

// Generate dynamic CSS for menu items
export const generateMenuItemCSS = (token) => `
  /* Theme-based scrollbar styling with very mild opacity */
  .mobile-more-menu-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-thumb {
    background-color: ${token?.colorText}08;
    border-radius: 3px;
    transition: background-color 0.2s ease;
  }
  
  .mobile-more-menu-container::-webkit-scrollbar-thumb:hover {
    background-color: ${token?.colorText}12;
  }
  
  /* Firefox scrollbar styling */
  .mobile-more-menu-container {
    scrollbar-width: thin;
    scrollbar-color: ${token?.colorText}08 transparent;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title {
    height: 60px !important;
    line-height: 60px !important;
    padding: 0 24px !important;
    margin: 0 !important;
    border-bottom: 0.5px solid ${token?.colorBorder} !important;
    font-size: 17px !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
    letter-spacing: -0.01em !important;
    border-radius: 0 !important;
    color: ${token?.colorText} !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item:last-child,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu:last-child .ant-menu-submenu-title {
    border-bottom: none !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected {
    background-color: ${token?.colorPrimaryBg} !important;
    color: ${token?.colorPrimary} !important;
    font-weight: 600 !important;
    transform: scale(1.02) !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item:hover,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title:hover {
    background-color: ${token?.colorBgTextHover} !important;
    transform: scale(1.01) !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item:active,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title:active {
    transform: scale(0.98) !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-icon,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-title .ant-menu-item-icon {
    font-size: 22px !important;
    color: ${token?.colorTextSecondary} !important;
    margin-inline-end: 16px !important;
    transition: all 0.2s ease !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-item-selected .ant-menu-item-icon,
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-item-icon {
    color: ${token?.colorPrimary} !important;
    transform: scale(1.05) !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-submenu-arrow {
    inset-inline-end: 24px !important;
    transition: transform 0.2s ease !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-sub {
    background-color: ${token?.colorFillQuaternary} !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item {
    padding-inline-start: 68px !important;
    background-color: ${token?.colorFillQuaternary} !important;
    border-bottom: 0.5px solid ${token?.colorBorder} !important;
    height: 56px !important;
    line-height: 56px !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item:hover {
    background-color: ${token?.colorBgTextHover} !important;
  }
  
  .mobile-more-menu-container .ant-menu-inline .ant-menu-sub .ant-menu-item-selected {
    background-color: ${token?.colorBgTextActive} !important;
    color: ${token?.colorPrimary} !important;
    font-weight: 600 !important;
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
  initial: {
    y: "100%",
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.5
    }
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const handleBarVariants = {
  initial: { scaleX: 0.8, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 }
  },
  exit: {
    scaleX: 0.8,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const headerVariants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.4 }
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const contentVariants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.4,
      staggerChildren: 0.05
    }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const handleBarHoverVariants = {
  hover: { scaleX: 1.2 },
  tap: { scaleX: 0.9 }
};

export const safeAreaVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.3 }
  }
};

export const expandIconVariants = {
  open: { rotate: 0 },
  closed: { rotate: 0 },
  transition: { duration: 0.2 }
};