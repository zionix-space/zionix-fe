// AppTopBar styles - Enterprise SaaS Design (Senior UX Standards)
export const useStyles = (token) => ({
  topBarStyle: {
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorder}`,
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    userSelect: "none", // Prevent text selection on topbar
  },

  leftSectionStyle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "32px", // 8px grid: 4 * 8px
  },

  brandContainerStyle: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none", // Prevent text selection on brand
  },

  logoTextStyle: {
    fontSize: "18px",
    fontWeight: "600",
    color: token.colorText,
    letterSpacing: "-0.01em",
    userSelect: "none",
  },

  navigationContainerStyle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    userSelect: "none", // Prevent text selection on navigation
  },

  menuStyle: {
    // background: "transparent",
    // border: "none",
    fontSize: "14px",
    fontWeight: 600,
    // lineHeight: 1,
    // flex: 1,
    // "& .ant-menu-item": {
    //   padding: "0 16px",
    //   margin: "0 4px",
    //   height: "32px",
    //   lineHeight: "32px",
    //   borderRadius: "6px",
    //   transition: "all 0.2s ease",
    //   color: token.colorTextSecondary,
    // },
    // "& .ant-menu-item:hover": {
    //   backgroundColor: token.colorFillQuaternary,
    //   color: token.colorText,
    // },
    // '& .ant-menu-item-selected': {
    //   backgroundColor: token.colorPrimary,
    //   color: token.colorWhite,
    //   fontWeight: 600,
    // },
    // '& .ant-menu-item-selected::after': {
    //   display: 'none',
    // },
  },

  rightActionsStyle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
    userSelect: "none", // Prevent text selection on actions
  },

  iconButtonStyle: {
    border: "none",
    background: "transparent",
    color: token.colorTextSecondary,
    fontSize: "16px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: token.borderRadius,
    transition: "all 0.2s ease",
    userSelect: "none", // Prevent text selection on buttons
    "&:hover": {
      backgroundColor: token.colorFillQuaternary,
      color: token.colorText,
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
    borderRadius: token.borderRadius,
    transition: "all 0.2s ease",
    color: isRTL ? token.colorWhite : token.colorTextSecondary,
    userSelect: "none", // Prevent text selection on RTL toggle
    "&:hover": {
      backgroundColor: isRTL ? token.colorPrimary : token.colorFillQuaternary,
      color: isRTL ? token.colorWhite : token.colorText,
    },
  }),
});
