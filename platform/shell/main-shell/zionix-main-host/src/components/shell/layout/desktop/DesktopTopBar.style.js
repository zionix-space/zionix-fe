// AppTopBar styles - 100% Finora Match
export const useStyles = (token) => ({
  topBarStyle: {
    background: token.colorBgLayout,
    borderBottom: "none",
    boxShadow: "none",
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
  },

  navigationContainerStyle: {
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none",
    backgroundColor: token.colorBgContainer, // Match sidebar capsule
    borderRadius: "30px",
    padding: "3px",
    border: "none", // No border like sidebar
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`, // Match sidebar shadow
    height: "45px",
  },

  menuStyle: {
    background: "transparent",
    border: "none !important",
    fontSize: "14px", // Increased from 13px
    fontWeight: 500, // Increased from 400 - bolder
    display: "inline-flex",
    lineHeight: "normal",
    "& .ant-menu-overflow": {
      display: "flex !important",
      border: "none !important",
    },
    "& .ant-menu-overflow-item": {
      flex: "0 0 auto !important",
      display: "inline-flex !important",
    },
    "& .ant-menu-item": {
      padding: "0 16px !important", // Increased from 12px
      margin: "0 2px !important",
      height: "28px !important",
      lineHeight: "28px !important",
      borderRadius: "10px !important",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important",
      color: `${token.colorTextSecondary} !important`, // Lighter for unselected
      border: "none !important",
      borderBottom: "none !important",
      background: "transparent !important",
      position: "relative !important",
      display: "inline-flex !important",
      alignItems: "center !important",
      whiteSpace: "nowrap !important",
      fontWeight: "500 !important", // Bold
    },
    "& .ant-menu-item::before": {
      display: "none !important",
    },
    "& .ant-menu-item::after": {
      content: "'' !important",
      display: "none !important",
      border: "none !important",
      borderBottom: "none !important",
      height: "0 !important",
      width: "0 !important",
    },
    "& .ant-menu-item:hover": {
      backgroundColor: `${token.colorFillQuaternary} !important`,
      color: `${token.colorText} !important`,
      borderBottom: "none !important",
    },
    "& .ant-menu-item-selected": {
      backgroundColor: `${token.colorPrimary} !important`,
      color: `${token.colorWhite} !important`,
      fontWeight: "600 !important", // Extra bold for selected
      border: "none !important",
      borderBottom: "none !important",
      boxShadow: `0 2px 8px ${token.colorPrimary}50, inset 0 1px 0 rgba(255, 255, 255, 0.2) !important`, // Stronger shadow
      transform: "translateY(-1px) !important", // Slight lift for button feel
    },
    "& .ant-menu-item-selected::before": {
      display: "none !important",
    },
    "& .ant-menu-item-selected::after": {
      content: "'' !important",
      display: "none !important",
      border: "none !important",
      borderBottom: "none !important",
      height: "0 !important",
      width: "0 !important",
    },
    "& .ant-menu-item-active::after": {
      display: "none !important",
      borderBottom: "none !important",
    },
    "& .ant-menu-submenu": {
      "& .ant-menu-submenu-title": {
        padding: "0 16px !important", // Increased from 12px
        margin: "0 2px !important",
        height: "28px !important",
        lineHeight: "28px !important",
        borderRadius: "10px !important",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important",
        color: `${token.colorTextSecondary} !important`,
        fontWeight: "500 !important", // Bold
      },
      "&:hover .ant-menu-submenu-title": {
        backgroundColor: `${token.colorFillQuaternary} !important`,
        color: `${token.colorText} !important`,
      },
    },
  },

  rightActionsStyle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    flexShrink: 0,
    userSelect: "none",
    backgroundColor: token.colorBgContainer, // Match sidebar capsule
    borderRadius: "30px",
    padding: "3px",
    border: "none", // No border like sidebar
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`, // Match sidebar shadow
    height: "45px",
    position: "absolute",
    right: "24px",
  },

  iconButtonStyle: {
    border: "none",
    background: "transparent",
    color: token.colorTextTertiary, // Match sidebar text color
    fontSize: "18px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    userSelect: "none",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: `${token.colorFillQuaternary}`, // Match sidebar hover
      color: token.colorText,
    },
  },

  // Dynamic style for RTL toggle button
  rtlToggleStyle: (isRTL) => ({
    border: "none",
    background: isRTL ? token.colorPrimary : "transparent",
    fontSize: "16px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
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
