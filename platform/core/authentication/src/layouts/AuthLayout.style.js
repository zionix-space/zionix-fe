import { useMemo } from "react";

/**
 * Authentication Layout Styles - Following host app pattern
 * Uses design system tokens and RTL-aware properties
 * Responsive design for mobile and desktop with proper token usage
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main layout container
    layoutContainerStyle: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

    // Mobile layout container
    mobileLayoutContainerStyle: {
      minHeight: "100vh",
      background: token.colorBgLayout,
      padding: 0,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    },

    // Desktop layout container
    desktopLayoutContainerStyle: {
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${token.colorPrimary}08 0%, ${token.colorBgLayout} 50%, ${token.colorPrimary}05 100%)`,
      padding: token.paddingLG,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    // Main container
    containerStyle: {
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      position: "relative",
    },

    // Mobile container
    mobileContainerStyle: {
      width: "100%",
      maxWidth: "100%",
      margin: "0 auto",
      padding: `${token.paddingXL}px ${token.paddingLG}px`,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    // Desktop container
    desktopContainerStyle: {
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      padding: 0,
    },

    // Card styles for mobile (no card styling - native app feel)
    mobileCardStyle: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      padding: 0,
      borderRadius: 0,
    },

    // Card styles for desktop (modern, clean card styling)
    desktopCardStyle: {
      background: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorder}`,
      boxShadow: `
        0 1px 2px 0 rgba(0, 0, 0, 0.03),
        0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02)
      `,
      padding: `${token.paddingXL * 1.5}px ${token.paddingXL}px`,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
      "&:hover": {
        boxShadow: `
          0 4px 6px -1px rgba(0, 0, 0, 0.05),
          0 2px 4px -1px rgba(0, 0, 0, 0.03)
        `,
        transform: "translateY(-1px)",
      },
    },

    // Header section
    headerContainerStyle: {
      textAlign: "center",
      paddingTop: 0,
    },

    // Mobile header
    mobileHeaderContainerStyle: {
      textAlign: "center",
      marginBottom: token.marginXXL,
      paddingTop: token.paddingXXL,
    },

    // Desktop header
    desktopHeaderContainerStyle: {
      textAlign: "center",
      marginBottom: token.marginXL,
      paddingTop: 0,
    },

    // Title styles
    titleStyle: {
      color: token.colorText,
      textAlign: "center",
    },

    // Mobile title
    mobileTitleStyle: {
      fontSize: token.fontSizeHeading2,
      fontWeight: 600,
      lineHeight: 1.3,
      color: token.colorText,
      marginBottom: token.marginSM,
      textAlign: "center",
    },

    // Desktop title
    desktopTitleStyle: {
      fontSize: token.fontSizeHeading1,
      fontWeight: 700,
      lineHeight: 1.2,
      color: token.colorText,
      marginBottom: token.marginMD,
      textAlign: "center",
      letterSpacing: "-0.02em",
      fontFamily: token.fontFamilyHeading || token.fontFamily,
    },

    // Subtitle styles
    subtitleStyle: {
      color: token.colorTextSecondary,
      textAlign: "center",
    },

    // Mobile subtitle
    mobileSubtitleStyle: {
      fontSize: token.fontSize,
      fontWeight: 400,
      lineHeight: 1.4,
      color: token.colorTextSecondary,
      marginBottom: token.marginXL,
      textAlign: "center",
    },

    // Desktop subtitle
    desktopSubtitleStyle: {
      fontSize: token.fontSizeLG,
      fontWeight: 500,
      lineHeight: 1.5,
      color: token.colorTextSecondary,
      marginBottom: token.marginXXL,
      textAlign: "center",
      letterSpacing: "0.01em",
      maxWidth: "400px",
      margin: `0 auto ${token.marginXXL}px auto`,
    },

    // Logo container
    logoContainerStyle: {
      textAlign: "center",
      marginBottom: token.marginXL,
    },

    // Mobile logo container
    mobileLogoContainerStyle: {
      textAlign: "center",
      marginBottom: token.marginXXL,
      paddingTop: token.paddingXL,
    },

    // Desktop logo container
    desktopLogoContainerStyle: {
      textAlign: "center",
      marginBottom: token.marginXL,
      paddingTop: 0,
    },

    // Footer section
    footerContainerStyle: {
      textAlign: "center",
      marginTop: token.marginXL,
      paddingTop: token.paddingMD,
    },

    // Mobile footer
    mobileFooterContainerStyle: {
      textAlign: "center",
      marginTop: token.marginXXL,
      paddingTop: token.paddingMD,
      borderTop: "none",
      paddingBottom: token.paddingXXL,
    },

    // Desktop footer
    desktopFooterContainerStyle: {
      textAlign: "center",
      marginTop: token.marginXL,
      paddingTop: token.paddingMD,
      borderTop: `1px solid ${token.colorBorderSecondary}`,
      paddingBottom: 0,
    },

    // Content wrapper for animations
    contentWrapperStyle: {
      position: "relative",
    },
  }), [token]);
};

/**
 * Animation variants for Framer Motion
 */
export const layoutVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const cardVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 30,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const logoVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};