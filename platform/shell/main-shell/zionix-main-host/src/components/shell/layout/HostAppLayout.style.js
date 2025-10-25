// HostAppLayout styles extracted to external file
export const useStyles = (token) => ({
  // Main container style - simple div instead of Ant Layout
  containerStyle: {
    height: "100vh",
    width: "100vw",
    background: token.colorBgLayout,
    overflow: "hidden", // Prevent page-level scrolling
    position: "relative",
  },

  // Content area style - positioned to account for fixed sidebar and top bar
  contentStyle: (collapsed) => ({
    background: token.colorBgContainer,
    position: "absolute",
    top: "64px", // Account for top bar height
    insetInlineStart: collapsed ? "64px" : "260px", // Account for sidebar width - RTL aware
    insetInlineEnd: "0",
    bottom: "0",
    padding: "24px",
    overflow: "auto", // Only content should scroll
    transition: "inset-inline-start 0.2s ease", // Smooth transition when sidebar collapses - RTL aware
  }),

  // Default content placeholder style
  defaultContentStyle: (token) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    color: token.colorTextSecondary,
    fontSize: "16px",
  }),
})