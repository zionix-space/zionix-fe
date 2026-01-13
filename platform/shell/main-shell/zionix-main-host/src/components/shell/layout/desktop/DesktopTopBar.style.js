// AppTopBar styles - Theme-aware
export const useStyles = (token, isDarkMode = false) => {
  const getLightPrimaryBg = () => {
    return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
  };

  return {
    topBarStyle: {
      background: getLightPrimaryBg(),
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: 'none',
      boxShadow: 'none',
      padding: "0 20px",
      height: "52px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      userSelect: "none",
    },

    leftSectionStyle: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      gap: "24px",
      justifyContent: "center",
    },

    brandContainerStyle: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      userSelect: "none",
      position: "absolute",
      left: "20px",
      height: "100%",
    },

    logoTextStyle: {
      fontSize: "16px",
      fontWeight: "600",
      color: token.colorText,
      letterSpacing: "0",
      userSelect: "none",
      opacity: 0.85,
    },

    navigationContainerStyle: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      userSelect: "none",
      background: token.colorBgContainer,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: "8px",
      padding: "2px",
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: 'none',
      height: "32px",
    },

    menuStyle: {
      background: "transparent",
      border: "none !important",
      fontSize: "14px",
      fontWeight: 500,
      display: "inline-flex",
      lineHeight: "normal",
      // Note: All menu item styling is handled in injected CSS in DesktopTopBar.jsx
    },

    rightActionsStyle: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      flexShrink: 0,
      userSelect: "none",
      background: token.colorBgContainer,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderRadius: "8px",
      padding: "2px",
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: 'none',
      height: "32px",
      position: "absolute",
      right: "20px",
    },

    iconButtonStyle: {
      border: "none",
      background: "transparent",
      color: token.colorText,
      fontSize: "15px",
      fontWeight: 500,
      opacity: 0.6,
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      userSelect: "none",
      flexShrink: 0,
      "&:hover": {
        backgroundColor: token.colorFillQuaternary,
        color: token.colorPrimary,
        opacity: 0.9,
      },
    },

    // Dynamic style for RTL toggle button
    rtlToggleStyle: (isRTL) => ({
      border: "none",
      background: isRTL ? token.colorPrimary : "transparent",
      fontSize: "16px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      color: isRTL ? token.colorWhite : token.colorTextTertiary,
      userSelect: "none",
      flexShrink: 0,
      "&:hover": {
        backgroundColor: isRTL ? token.colorPrimary : token.colorPrimaryBg,
        color: isRTL ? token.colorWhite : token.colorText,
      },
    }),
  };
};
