// AppTopBar styles - Premium glassmorphism
export const useStyles = (token, isDarkMode = false) => ({
  topBarStyle: {
    background: 'transparent', // Transparent to show through the main background
    backdropFilter: 'none', // No blur - unified with background
    WebkitBackdropFilter: 'none',
    borderBottom: 'none', // No border for seamless look
    boxShadow: 'none', // No shadow
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
    background: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)', // Theme-aware: white for dark mode, black for light mode
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: "8px",
    padding: "2px",
    border: `1px solid ${token.colorBorder}30`,
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
    background: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)', // Theme-aware: white for dark mode, black for light mode
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: "8px",
    padding: "2px",
    border: `1px solid ${token.colorBorder}30`,
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
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
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
      backgroundColor: isRTL ? token.colorPrimary : `${token.colorPrimary}10`,
      color: isRTL ? token.colorWhite : token.colorText,
    },
  }),
});
