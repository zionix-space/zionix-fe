import { useMemo } from "react";

/**
 * Login Page Styles - Following host app pattern
 * Uses design system tokens and RTL-aware properties
 * Responsive design for mobile and desktop with proper token usage
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Input field styles
    inputStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
    },

    // Mobile input styles
    mobileInputStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadius,
      fontSize: token.fontSize,
    },

    // Desktop input styles
    desktopInputStyle: {
      height: token.controlHeightLG,
      borderRadius: token.borderRadiusLG,
      fontSize: token.fontSizeLG,
      border: `1px solid ${token.colorBorder}`,
      boxShadow: 'none',
      transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
    },

    // Button styles
    buttonStyle: {
      borderRadius: token.borderRadius,
      fontSize: token.fontSizeLG,
      fontWeight: 600,
    },

    // Mobile button styles
    mobileButtonStyle: {
      height: 48, // Minimum 48px for mobile touch targets
      borderRadius: token.borderRadius,
      fontSize: token.fontSizeLG,
      fontWeight: 600,
    },

    // Desktop button styles
    desktopButtonStyle: {
      height: token.controlHeightXL,
      borderRadius: token.borderRadiusLG,
      fontSize: token.fontSizeXL,
      fontWeight: 600,
      boxShadow: `0 2px 4px 0 ${token.colorPrimary}20`,
      border: 'none',
      transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
    },

    // Form item styles
    formItemStyle: {
      marginBottom: token.marginLG,
    },

    // Mobile form item styles
    mobileFormItemStyle: {
      marginBottom: token.marginXL, // More space on mobile for native feel
    },

    // Desktop form item styles
    desktopFormItemStyle: {
      marginBottom: token.marginLG,
    },

    // Checkbox styles
    checkboxStyle: {
      fontSize: token.fontSize,
    },

    // Mobile checkbox styles
    mobileCheckboxStyle: {
      fontSize: token.fontSizeLG, // Larger text on mobile
    },

    // Desktop checkbox styles
    desktopCheckboxStyle: {
      fontSize: token.fontSize,
    },

    // Link styles
    linkStyle: {
      fontSize: token.fontSize,
      display: 'inline',
      alignItems: 'baseline',
    },

    // Mobile link styles
    mobileLinkStyle: {
      fontSize: token.fontSizeLG, // Larger text on mobile
      minHeight: '44px', // Ensure touch target size
      display: 'inline-flex',
      alignItems: 'center',
    },

    // Desktop link styles
    desktopLinkStyle: {
      fontSize: token.fontSize,
      display: 'inline',
      alignItems: 'baseline',
    },

    // Form container styles
    formContainerStyle: {
      width: '100%',
    },

    // Mobile form container styles
    mobileFormContainerStyle: {
      width: '100%',
      padding: `0 ${token.paddingMD}px`, // Add horizontal padding for form content
    },

    // Desktop form container styles
    desktopFormContainerStyle: {
      width: '100%',
    },

    // Footer container styles
    footerContainerStyle: {
      width: '100%',
      textAlign: 'center',
    },

    // Remember me container styles
    rememberMeContainerStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: token.marginLG,
    },

    // Mobile remember me container styles
    mobileRememberMeContainerStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: token.marginXL,
      minHeight: '44px', // Ensure touch target size
    },

    // Desktop remember me container styles
    desktopRememberMeContainerStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: token.marginLG,
    },

    // Forgot password link styles
    forgotPasswordLinkStyle: {
      fontSize: token.fontSize,
      fontWeight: 500,
    },

    // Mobile forgot password link styles
    mobileForgotPasswordLinkStyle: {
      fontSize: token.fontSizeLG,
      fontWeight: 500,
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
    },

    // Desktop forgot password link styles
    desktopForgotPasswordLinkStyle: {
      fontSize: token.fontSize,
      fontWeight: 500,
    },

    // Sign up text styles
    signUpTextStyle: {
      fontSize: token.fontSize,
    },

    // Mobile sign up text styles
    mobileSignUpTextStyle: {
      fontSize: token.fontSizeLG,
    },

    // Desktop sign up text styles
    desktopSignUpTextStyle: {
      fontSize: token.fontSize,
    },

    // Sign up link styles
    signUpLinkStyle: {
      fontWeight: 500,
    },

    // Form validation error styles
    errorTextStyle: {
      color: token.colorError,
      fontSize: token.fontSizeSM,
      marginTop: token.marginXS,
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

export const inputVariants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const formItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}