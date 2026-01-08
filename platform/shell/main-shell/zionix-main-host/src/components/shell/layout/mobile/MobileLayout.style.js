import { useMemo } from "react";

/**
 * Mobile Layout Styles - Clean and simple layout following desktop patterns
 * Uses design system tokens and RTL-aware properties
 * Unified glassmorphism background matching header
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main layout container - Solid unified background (same as desktop)
    layoutContainerStyle: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      backgroundColor: token.colorBgLayout,
      overflow: "hidden",
    },

    // Main content area - exact fintech spacing
    mainContentStyle: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      paddingBlockStart: 'calc(64px + env(safe-area-inset-top))',
      paddingBlockEnd: 'calc(68px + env(safe-area-inset-bottom))',
      overflow: "hidden",
      backgroundColor: token.colorBgLayout,
    },

    // Content wrapper - Same background as layout
    contentWrapperStyle: {
      flex: 1,
      overflow: "auto",
      paddingInline: token.paddingMD,
      paddingBlock: token.paddingMD,
      backgroundColor: token.colorBgLayout,
    },
  }), [token]);
};
