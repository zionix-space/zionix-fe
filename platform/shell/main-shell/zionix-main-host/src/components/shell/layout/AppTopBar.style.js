// AppTopBar styles extracted to external file
export const useStyles = (token) => ({
  topBarStyle: {
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logoStyle: {
    fontSize: "20px",
    fontWeight: 600,
    color: token.colorPrimary,
    marginRight: "32px",
  },

  menuStyle: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: 500,
  },

  rightActionsStyle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
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
  },

  leftSectionStyle: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  // Dynamic style for RTL toggle button
  rtlToggleStyle: (isRTL) => ({
    border: "none",
    background: "transparent",
    fontSize: "16px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isRTL ? token.colorPrimary : token.colorTextSecondary,
  }),
});