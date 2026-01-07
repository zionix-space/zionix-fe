// AppTopBar styles - Premium glassmorphism
export const useStyles = (token) => ({
  topBarStyle: {
    background: 'transparent', // Transparent to show through the main background
    backdropFilter: 'none', // No blur - unified with background
    WebkitBackdropFilter: 'none',
    borderBottom: 'none', // No border for seamless look
    boxShadow: 'none', // No shadow
    padding: "0 24px",
    height: "64px",
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
    gap: "32px",
    justifyContent: "center",
  },

  brandContainerStyle: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none",
    position: "absolute",
    left: "24px",
    height: "100%",
  },

  logoTextStyle: {
    fontSize: "18px",
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
    background: `${token.colorBgContainer}B3`,
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: "18px",
    padding: "6px",
    border: `1px solid ${token.colorBorder}30`,
    boxShadow: `
      0 4px 12px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px ${token.colorBorder}40,
      inset 0 1px 0 0 ${token.colorBgElevated}60
    `,
    height: "52px",
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
    gap: "6px",
    flexShrink: 0,
    userSelect: "none",
    background: `${token.colorBgContainer}B3`,
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: "18px",
    padding: "6px",
    border: `1px solid ${token.colorBorder}30`,
    boxShadow: `
      0 4px 12px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px ${token.colorBorder}40,
      inset 0 1px 0 0 ${token.colorBgElevated}60
    `,
    height: "52px",
    position: "absolute",
    right: "24px",
  },

  iconButtonStyle: {
    border: "none",
    background: "transparent",
    color: token.colorText,
    fontSize: "22px",
    fontWeight: 600,
    opacity: 0.65,
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    userSelect: "none",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: token.colorFillQuaternary,
      color: token.colorPrimary,
      transform: "scale(1.08)",
      opacity: 1,
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
