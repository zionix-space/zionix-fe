// MenuBuilderTopBar styles - Following existing DesktopTopBar patterns
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
    userSelect: "none",
  },

  leftSectionStyle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "32px",
  },

  brandContainerStyle: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    userSelect: "none",
  },

  titleStyle: {
    fontSize: "18px",
    fontWeight: "600",
    color: token.colorText,
    letterSpacing: "-0.01em",
    userSelect: "none",
    margin: 0,
  },

  centerSectionStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "16px",
  },

  previewModeSelect: {
    minWidth: "120px",
    "& .ant-select-selector": {
      borderRadius: token.borderRadius,
      border: `1px solid ${token.colorBorder}`,
      backgroundColor: token.colorBgContainer,
    },
  },

  rightActionsStyle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
    userSelect: "none",
    flex: 1,
    justifyContent: "flex-end",
  },

  iconButtonStyle: {
    border: `1px solid ${token.colorBorder}`,
    background: token.colorBgContainer,
    color: token.colorTextSecondary,
    fontSize: "14px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: token.borderRadius,
    transition: "all 0.2s ease",
    userSelect: "none",
    "&:hover": {
      backgroundColor: token.colorFillQuaternary,
      color: token.colorText,
      borderColor: token.colorPrimary,
    },
  },

  saveButtonStyle: {
    height: "32px",
    borderRadius: token.borderRadius,
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
});