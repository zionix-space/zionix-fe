// CSS-in-JS styles with zx-host prefix for module federation isolation
export const useStyles = (token) => ({
  zxHostSidebarContainer: {
    background: token.colorBgContainer,
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    top: '64px',
    insetInlineStart: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    userSelect: 'none', // Prevent text selection on sidebar
  },

  zxHostSidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
    userSelect: 'none', // Prevent text selection on sidebar content
    overflow: 'hidden', // Prevent the entire sidebar from scrolling
  },

  zxHostMainContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },

  zxHostToggleContainer: {
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none', // Prevent text selection on toggle
    padding: `${token.paddingSM}px ${token.paddingSM}px`,
    minHeight: "48px",
    gap: `${token.paddingSM}px`,
  },

  zxHostToggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: "32px",
    height: "32px",
    borderRadius: token.borderRadius,
    backgroundColor: "transparent",
    border: "none",
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    position: "relative",
    flexShrink: 0,
  },

  zxHostToggleButtonHover: {
    backgroundColor: token.colorFillSecondary,
  },

  zxHostToggleIcon: {
    fontSize: "16px",
    color: token.colorText,
  },

  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },

  zxHostSectionHeader: {
    padding: "12px 16px 6px 16px",
    fontSize: "11px",
    fontWeight: 500,
    color: token.colorTextTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    userSelect: "none", // Prevent text selection on section headers
    marginTop: "8px",
  },

  zxHostSectionHeaderCollapsed: {
    height: token.padding,
    margin: `${token.paddingSM}px 0`,
  },

  zxHostSectionDivider: {
    flex: 1,
    height: '1px',
  },

  zxHostMenuContainer: {
    userSelect: "none", // Prevent text selection on menu container
    marginBottom: "8px", // Minimal spacing between sections
  },

  zxHostMenuItemBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  zxHostProfileSection: {
    flexShrink: 0,
    marginTop: 'auto',
    position: 'relative',
    zIndex: 1,
  },

  zxHostProfileContainer: {
    padding: `${token.paddingSM}px ${token.paddingSM}px`,
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    userSelect: "none", // Prevent text selection on profile container
  },

  zxHostProfileContainerCollapsed: {
    padding: `${token.paddingSM}px ${token.paddingXS}px`,
  },

  zxHostProfileContent: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: token.borderRadius,
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    justifyContent: "flex-start",
  },

  zxHostProfileContentCollapsed: {
    padding: token.paddingXS,
    justifyContent: "center",
  },

  zxHostProfileContentHover: {
    backgroundColor: token.colorFillSecondary,
  },

  zxHostProfileInfo: {
    marginLeft: token.paddingSM,
    flex: 1,
  },

  zxHostProfileName: {
    fontWeight: 600,
    color: token.colorText,
    fontSize: token.fontSizeSM,
    lineHeight: 1.3,
    marginBottom: "1px",
  },

  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: 1.2,
  },

  zxHostSearchContainer: {
    padding: `0 ${token.paddingXS}px`,
    flex: 1,
  },

  zxHostSearchInput: {
    borderRadius: token.borderRadiusSM,
    height: "28px",
    fontSize: "13px",
    border: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: token.colorBorder,
      backgroundColor: token.colorBgContainer,
    },
    "&:focus": {
      borderColor: token.colorPrimary,
      backgroundColor: token.colorBgContainer,
      boxShadow: `0 0 0 2px ${token.colorPrimary}10`,
    },
  },
});
