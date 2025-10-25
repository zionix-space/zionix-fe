import { useMemo } from "react";

/**
 * Mobile Bottom Navigation Styles - Clean styling matching screenshot
 * Uses proper spacing and sizing for mobile devices
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main navigation container - taller and more spacious
    navigationContainerStyle: {
      position: 'fixed',
      bottom: 0,
      insetInlineStart: 0,
      insetInlineEnd: 0,
      height: '83px', // Fixed height for proper spacing
      paddingBottom: '34px', // Safe area for home indicator
      backgroundColor: token.colorBgContainer,
      borderBlockStart: `1px solid ${token.colorBorderSecondary}`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      paddingTop: '8px',
      paddingInline: '8px',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
    },

    // Navigation item - proper spacing
    navItemStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '6px 4px',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      minHeight: '50px',
    },

    // Icon container - clean and simple
    iconContainerStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '4px',
      padding: '6px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
    },

    // Icon styling - proper size
    iconStyle: {
      fontSize: '22px',
      transition: 'color 0.2s ease',
    },

    // Label styling - clean typography
    labelStyle: {
      fontSize: '10px',
      textAlign: 'center',
      lineHeight: '12px',
      transition: 'all 0.2s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      whiteSpace: 'nowrap',
    },
  }), [token]);
};