import { useMemo } from "react";

/**
 * Mobile Bottom Navigation Styles - Clean CSS-in-JS approach
 * Fixed styling issues and proper responsive design
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main navigation container - clean and properly sized
    navigationContainerStyle: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px', // Fixed height for mobile
      paddingBottom: '8px', // Safe area padding
      backgroundColor: token.colorBgContainer,
      borderTop: `1px solid ${token.colorBorderSecondary}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingTop: '8px',
      paddingLeft: '8px',
      paddingRight: '8px',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
    },

    // Navigation item - clean layout
    navItemStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 2px',
      cursor: 'pointer',
      borderRadius: token.borderRadiusSM,
      transition: 'all 0.2s ease',
      minHeight: '44px',
    },

    // Icon container - simple and clean
    iconContainerStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2px',
    },

    // Base icon styling
    iconStyle: {
      fontSize: '22px',
      transition: 'all 0.2s ease',
    },

    // Active icon styling
    activeIconStyle: {
      fontSize: '22px',
      color: token.colorPrimary,
      transition: 'all 0.2s ease',
    },

    // Inactive icon styling
    inactiveIconStyle: {
      fontSize: '22px',
      color: token.colorTextSecondary,
      transition: 'all 0.2s ease',
    },

    // Base label styling
    labelStyle: {
      fontSize: '10px',
      textAlign: 'center',
      lineHeight: '12px',
      transition: 'all 0.2s ease',
      fontFamily: token.fontFamily,
      whiteSpace: 'nowrap',
      marginTop: '1px',
    },

    // Active label styling
    activeLabelStyle: {
      fontSize: '10px',
      textAlign: 'center',
      lineHeight: '12px',
      color: token.colorPrimary,
      fontWeight: 600,
      transition: 'all 0.2s ease',
      fontFamily: token.fontFamily,
      whiteSpace: 'nowrap',
      marginTop: '1px',
    },

    // Inactive label styling
    inactiveLabelStyle: {
      fontSize: '10px',
      textAlign: 'center',
      lineHeight: '12px',
      color: token.colorTextSecondary,
      fontWeight: 400,
      transition: 'all 0.2s ease',
      fontFamily: token.fontFamily,
      whiteSpace: 'nowrap',
      marginTop: '1px',
    },

    // Hover state for nav items
    navItemHoverStyle: {
      backgroundColor: token.colorFillQuaternary,
    },
  }), [token]);
};