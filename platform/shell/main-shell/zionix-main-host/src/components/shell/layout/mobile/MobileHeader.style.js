import { useMemo } from "react";

/**
 * Mobile Header Styles - Beautiful header with logo, search, and theme switch
 * Following desktop coding patterns with design system tokens
 */
export const useStyles = (token) => {
  return useMemo(
    () => ({
      // Main header container
      headerContainerStyle: {
        position: "fixed",
        top: 0,
        insetInlineStart: 0,
        insetInlineEnd: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: token.controlHeightLG + 16,
        paddingInline: token.paddingMD,
        paddingBlock: token.paddingSM,
        backgroundColor: token.colorBgContainer,
        borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: token.boxShadowTertiary,
      },

      // Left section - Logo
      leftSectionStyle: {
        display: "flex",
        alignItems: "center",
        flex: "0 0 auto",
        minWidth: 40,
      },

      // Center section - Search bar
      centerSectionStyle: {
        display: "flex",
        alignItems: "center",
        flex: "1 1 auto",
        paddingInline: token.paddingMD,
        maxWidth: 300,
      },

      // Right section - Theme switch
      rightSectionStyle: {
        display: "flex",
        alignItems: "center",
        flex: "0 0 auto",
        minWidth: 40,
      },

      // Search input styling
      searchInputStyle: {
        width: "100%",
        borderRadius: token.borderRadiusLG,
        backgroundColor: token.colorFillQuaternary,
        border: "none",
        fontSize: token.fontSizeSM,
        height: token.controlHeight,
        "::placeholder": {
          color: token.colorTextPlaceholder,
        },
        "&:focus": {
          backgroundColor: token.colorFillTertiary,
          boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`,
        },
        "&:hover": {
          backgroundColor: token.colorFillTertiary,
        },
      },

      // Search icon styling
      searchIconStyle: {
        color: token.colorTextTertiary,
        fontSize: token.fontSizeIcon,
      },

      // Theme toggle button styling
      themeToggleStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: token.controlHeight,
        height: token.controlHeight,
        borderRadius: token.borderRadiusLG,
        color: token.colorTextSecondary,
        fontSize: token.fontSizeIcon,
        transition: `all ${token.motionDurationMid}`,
        "&:hover": {
          backgroundColor: token.colorFillQuaternary,
          color: token.colorText,
        },
        "&:active": {
          backgroundColor: token.colorFillTertiary,
        },
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
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

export const logoVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const searchVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
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
      ease: "easeOut",
      delay: 0.2,
    },
  },
};
