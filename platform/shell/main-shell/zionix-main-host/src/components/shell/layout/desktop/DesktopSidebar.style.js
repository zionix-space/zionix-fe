// CSS-in-JS styles with zx-host prefix for module federation isolation
export const useStyles = (token) => ({
  zxHostSidebarContainer: {
    background: token.colorBgContainer,
    height: "calc(100vh - 64px)",
    position: "fixed",
    top: "64px",
    insetInlineStart: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    zIndex: 999,
    userSelect: "none", // Prevent text selection on sidebar
  },

  zxHostSidebarContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "calc(100vh - 64px)",
    userSelect: "none", // Prevent text selection on sidebar content
    overflow: "hidden", // Prevent the entire sidebar from scrolling
  },

  zxHostMainContent: {
    flex: 1,
    overflow: "auto",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    paddingBottom: "4px", // Reduced for better density
    paddingTop: "4px", // Reduced for better density
    // Firefox scrollbar styling
    scrollbarWidth: "thin",
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },

  zxHostToggleContainer: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Further reduced padding
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: token.colorFillQuaternary,
    userSelect: "none", // Prevent text selection on toggle
    minHeight: "40px", // Reduced height for more compact layout
    gap: token.paddingXS, // Add gap between search and toggle button
  },

  zxHostToggleButton: {
    width: "32px",
    height: "32px",
    borderRadius: token.borderRadius, // Consistent with other elements
    backgroundColor: "transparent",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease", // Faster, more responsive transition
    position: "relative",
    flexShrink: 0, // Prevent button from shrinking
  },

  zxHostToggleButtonHover: {
    backgroundColor: `${token.colorPrimary}10`,
    borderColor: `${token.colorPrimary}30`,
  },

  zxHostToggleIcon: {
    fontSize: "16px",
    color: token.colorTextSecondary,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
  },

  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },

  zxHostSectionHeader: {
    padding: "8px 16px 4px 16px", // Reduced padding for more compact look
    fontSize: "10px", // Smaller font size for less prominence
    fontWeight: 500, // Reduced from 600 for subtlety
    color: token.colorTextTertiary, // More subtle color
    textTransform: "uppercase",
    letterSpacing: "0.3px", // Reduced letter spacing
    display: "flex",
    alignItems: "center",
    gap: "6px", // Reduced gap
    userSelect: "none", // Prevent text selection on section headers
    marginTop: "4px", // Reduced top spacing
  },

  zxHostSectionHeaderCollapsed: {
    height: token.padding,
    margin: `${token.paddingSM}px 0`,
  },

  zxHostSectionDivider: {
    flex: 1,
    height: "1px",
  },

  zxHostMenuContainer: {
    padding: "0 8px", // Reduced padding for better density
    userSelect: "none", // Prevent text selection on menu container
    marginBottom: "4px", // Reduced spacing between sections
  },

  zxHostMenuItemBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  zxHostProfileSection: {
    flexShrink: 0,
    marginTop: "auto",
    position: "relative",
    zIndex: 1,
  },

  zxHostProfileContainer: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Reduced from token.padding
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    userSelect: "none", // Prevent text selection on profile container
  },

  zxHostProfileContainerCollapsed: {
    padding: token.paddingXS, // Reduced from token.paddingSM
  },

  zxHostProfileContent: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Reduced vertical padding
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
    marginLeft: token.paddingSM, // Reduced from token.padding
    flex: 1,
  },

  zxHostProfileName: {
    fontWeight: 600,
    color: token.colorText,
    fontSize: token.fontSizeSM, // Reduced from token.fontSize
    lineHeight: 1.3, // Tighter line height
    marginBottom: "1px", // Reduced from 2px
  },

  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: 1.2, // Tighter line height
  },

  zxHostSearchContainer: {
    padding: `0 ${token.paddingXS}px`, // Minimal padding for maximum compactness
    flex: 1,
  },

  zxHostSearchInput: {
    borderRadius: token.borderRadiusSM, // Slightly smaller radius for compactness
    height: "28px", // Reduced height for more compact look
    fontSize: "13px", // Slightly smaller font
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
