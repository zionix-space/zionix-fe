import { useMemo } from "react";

/**
 * Forgot Password Page Styles - Following host app pattern
 * Uses design system tokens and RTL-aware properties
 * Responsive design for mobile and desktop with proper token usage
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Input field styles
    inputStyle: {
      borderRadius: token.borderRadius,
    },

    // Mobile input styles
    mobileInputStyle: {
      height: token.controlHeight,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
    },

    // Desktop input styles
    desktopInputStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSizeLG,
    },

    // Button styles
    buttonStyle: {
      borderRadius: token.borderRadius,
      fontWeight: 600,
    },

    // Mobile button styles
    mobileButtonStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSizeLG,
      fontWeight: 600,
    },

    // Desktop button styles
    desktopButtonStyle: {
      height: token.controlHeightXL,
      borderRadius: token.borderRadius,
      fontSize: token.fontSizeXL,
      fontWeight: 600,
    },

    // Form item styles
    formItemStyle: {
      marginBottom: token.marginLG,
    },

    // Mobile form item styles
    mobileFormItemStyle: {
      marginBottom: token.marginMD,
    },

    // Desktop form item styles
    desktopFormItemStyle: {
      marginBottom: token.marginLG,
    },

    // Link styles
    linkStyle: {
      fontSize: token.fontSize,
    },

    // Mobile link styles
    mobileLinkStyle: {
      fontSize: token.fontSizeSM,
    },

    // Desktop link styles
    desktopLinkStyle: {
      fontSize: token.fontSize,
    },

    // Description text styles
    descriptionStyle: {
      color: token.colorTextSecondary,
      textAlign: 'center',
      lineHeight: 1.6,
      marginBottom: token.marginLG,
    },

    // Mobile description styles
    mobileDescriptionStyle: {
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
      textAlign: 'center',
      lineHeight: 1.6,
      marginBottom: token.marginLG,
    },

    // Desktop description styles
    desktopDescriptionStyle: {
      fontSize: token.fontSize,
      color: token.colorTextSecondary,
      textAlign: 'center',
      lineHeight: 1.6,
      marginBottom: token.marginLG,
    },

    // Success state styles
    successContainerStyle: {
      textAlign: 'center',
      padding: token.paddingLG,
    },

    // Success icon styles
    successIconStyle: {
      color: token.colorSuccess,
      marginBottom: token.marginLG,
    },

    // Mobile success icon styles
    mobileSuccessIconStyle: {
      fontSize: 48,
      color: token.colorSuccess,
      marginBottom: token.marginLG,
    },

    // Desktop success icon styles
    desktopSuccessIconStyle: {
      fontSize: 64,
      color: token.colorSuccess,
      marginBottom: token.marginLG,
    },

    // Success title styles
    successTitleStyle: {
      color: token.colorText,
      marginBottom: token.marginMD,
      fontWeight: 600,
    },

    // Mobile success title styles
    mobileSuccessTitleStyle: {
      fontSize: token.fontSizeHeading3,
      color: token.colorText,
      marginBottom: token.marginMD,
      fontWeight: 600,
    },

    // Desktop success title styles
    desktopSuccessTitleStyle: {
      fontSize: token.fontSizeHeading2,
      color: token.colorText,
      marginBottom: token.marginMD,
      fontWeight: 600,
    },

    // Success message styles
    successMessageStyle: {
      color: token.colorTextSecondary,
      marginBottom: token.marginXL,
      lineHeight: 1.6,
    },

    // Mobile success message styles
    mobileSuccessMessageStyle: {
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
      marginBottom: token.marginXL,
      lineHeight: 1.6,
    },

    // Desktop success message styles
    desktopSuccessMessageStyle: {
      fontSize: token.fontSize,
      color: token.colorTextSecondary,
      marginBottom: token.marginXL,
      lineHeight: 1.6,
    },

    // Email display styles
    emailDisplayStyle: {
      color: token.colorPrimary,
      fontWeight: 600,
      fontSize: token.fontSizeLG,
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      background: `${token.colorPrimary}08`,
      borderRadius: token.borderRadiusSM,
      border: `1px solid ${token.colorPrimary}20`,
      marginBottom: token.marginLG,
      display: 'inline-block',
    },

    // Back to login button styles
    backButtonStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: token.marginXS,
    },

    // Mobile back button styles
    mobileBackButtonStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: token.marginXS,
      width: '100%',
      justifyContent: 'center',
    },

    // Desktop back button styles
    desktopBackButtonStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: token.marginXS,
    },

    // Footer container styles
    footerContainerStyle: {
      width: '100%',
      textAlign: 'center',
    },

    // Form container styles
    formContainerStyle: {
      width: '100%',
    },

    // Alert styles for error messages
    alertStyle: {
      marginBottom: token.marginLG,
      borderRadius: token.borderRadius,
    },

    // Loading state styles
    loadingOverlayStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `${token.colorBgMask}80`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: token.borderRadiusLG,
      zIndex: 10,
    },

    // Resend link styles
    resendLinkStyle: {
      fontSize: token.fontSizeSM,
      color: token.colorTextTertiary,
      marginTop: token.marginMD,
    },

    // Mobile resend link styles
    mobileResendLinkStyle: {
      fontSize: token.fontSizeSM,
      color: token.colorTextTertiary,
      marginTop: token.marginMD,
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Desktop resend link styles
    desktopResendLinkStyle: {
      fontSize: token.fontSizeSM,
      color: token.colorTextTertiary,
      marginTop: token.marginMD,
    },
  }), [token]);
};

/**
 * Animation variants for Framer Motion
 */
export const formVariants = {
  initial: { opacity: 0, y: 20 },
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

export const successVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const buttonVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      delay: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const linkVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.3,
    },
  },
};

export const iconVariants = {
  initial: { opacity: 0, scale: 0.5 },
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

export const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};