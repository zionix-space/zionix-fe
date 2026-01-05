import { useMemo } from "react";

/**
 * Mobile Layout Styles - Clean and simple layout following desktop patterns
 * Uses design system tokens and RTL-aware properties
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main layout container
    layoutContainerStyle: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      backgroundColor: token.colorBgContainer,
      overflow: "hidden",
    },

    // Main content area - exact fintech spacing
    mainContentStyle: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      paddingBlockStart: 'calc(72px + env(safe-area-inset-top))',
      paddingBlockEnd: 'calc(82px + env(safe-area-inset-bottom))',
      overflow: "hidden",
    },

    // Content wrapper
    contentWrapperStyle: {
      flex: 1,
      overflow: "auto",
      paddingInline: token.paddingMD,
      paddingBlock: token.paddingMD,
      backgroundColor: token.colorBgContainer,
    },
  }), [token]);
};