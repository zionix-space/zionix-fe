// CSS-in-JS styles with zx-host prefix for module federation isolation
export const useStyles = (token) => ({
  zxHostSidebarContainer: {
    background: 'transparent', // Transparent to show through the main background
    backdropFilter: 'none', // No blur - unified with background
    WebkitBackdropFilter: 'none',
    height: 'calc(100vh - 64px)',
    position: 'fixed',
    top: '64px',
    insetInlineStart: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    userSelect: 'none',
    borderRight: 'none', // No border for seamless look
    boxShadow: 'none', // No shadow
  },

  zxHostSidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)', // Match new topbar height
    userSelect: 'none',
    overflow: 'hidden',
  },

  zxHostMainContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
    '&::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar for Chrome/Safari
    },
  },

  zxHostToggleContainer: {
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    padding: `${token.paddingSM}px 12px`,
    minHeight: '56px',
    gap: `${token.paddingSM}px`,
    backgroundColor: 'transparent',
  },

  // New Finora-style top section - compact spacing with consistent padding
  zxHostTopSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px',
    borderBottom: 'none',
    userSelect: 'none',
  },

  // Controls layout - hamburger + theme toggle
  zxHostControlsExpanded: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },

  zxHostControlsCollapsed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  // Premium Apple-style glassmorphism capsule for theme buttons
  // flexDirection is set dynamically: 'column' when collapsed, 'row' when expanded
  zxHostThemeCapsule: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    padding: '6px',
    background: `${token.colorBgContainer}B3`,
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: '18px',
    boxShadow: `
      0 4px 12px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px ${token.colorBorder}40,
      inset 0 1px 0 0 ${token.colorBgElevated}60
    `,
    width: 'fit-content',
    border: `1px solid ${token.colorBorder}30`,
  },

  zxHostThemeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '14px',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: token.colorText,
    fontSize: '22px',
    fontWeight: 600,
    opacity: 0.65,
    position: 'relative',
    '&:hover': {
      backgroundColor: token.colorFillQuaternary,
      transform: 'scale(1.08)',
      opacity: 1,
    },
  },

  zxHostThemeButtonActive: {
    background: `linear-gradient(135deg, ${token.colorPrimary}F0 0%, ${token.colorPrimaryHover}F0 100%)`,
    color: token.colorWhite,
    opacity: 1,
    boxShadow: `
      0 4px 12px ${token.colorPrimary}35,
      0 2px 6px ${token.colorPrimary}25,
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    transform: 'scale(1.05)',
  },

  zxHostToggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: token.colorBgContainer,
    border: `1px solid ${token.colorBorderSecondary}20`,
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
    transition: `all ${token.motionDurationMid} cubic-bezier(0.4, 0, 0.2, 1)`,
    position: 'relative',
    flexShrink: 0,
    opacity: 0.65,
  },

  zxHostToggleButtonHover: {
    backgroundColor: token.colorBgContainer,
    transform: 'scale(1.05)',
    boxShadow: `0 6px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    opacity: 1,
  },

  zxHostToggleIcon: {
    fontSize: '20px',
    fontWeight: 600,
    color: token.colorText,
  },

  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },

  zxHostSectionHeader: {
    padding: '20px 20px 8px 20px',
    fontSize: '11px',
    fontWeight: 600,
    color: token.colorTextTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    userSelect: 'none',
    marginTop: '0px',
    opacity: 0.45,
  },

  zxHostSectionHeaderCollapsed: {
    height: token.padding,
    margin: `${token.paddingSM}px 0`,
  },

  zxHostSectionDivider: {
    flex: 1,
    height: '1px',
    opacity: 0,
  },

  zxHostMenuContainer: {
    userSelect: 'none',
    marginBottom: '4px',
    padding: '8px',
    background: `${token.colorBgContainer}B3`,
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: '18px',
    margin: '0 12px 8px 12px',
    boxShadow: `
      0 4px 12px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px ${token.colorBorder}40,
      inset 0 1px 0 0 ${token.colorBgElevated}60
    `,
    border: `1px solid ${token.colorBorder}30`,
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

  zxHostProfileInfo: {
    marginLeft: token.paddingSM,
    flex: 1,
  },

  zxHostProfileName: {
    fontWeight: 600,
    color: token.colorText,
    fontSize: token.fontSizeSM,
    lineHeight: 1.3,
    marginBottom: '1px',
    opacity: 0.85,
  },

  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: 1.2,
    opacity: 0.6,
  },

  zxHostProfileMore: {
    color: token.colorTextTertiary,
    fontSize: '16px',
    marginLeft: 'auto',
  },

  zxHostProfileCollapsed: {
    padding: '0',
    borderTop: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
    margin: '0 12px 12px 12px',
  },

  zxHostProfileExpanded: {
    padding: '0',
    borderTop: 'none',
    backgroundColor: 'transparent',
    margin: '0 12px 12px 12px',
  },

  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: `${token.paddingXS + 2}px ${token.paddingSM}px`,
    borderRadius: '18px',
    background: `${token.colorBgContainer}B3`,
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: `1px solid ${token.colorBorder}30`,
    boxShadow: `
      0 4px 12px 0 rgba(0, 0, 0, 0.12),
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 1px ${token.colorBorder}40,
      inset 0 1px 0 0 ${token.colorBgElevated}60
    `,
    transition: `all 0.15s cubic-bezier(0.4, 0, 0.2, 1)`,
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: token.colorFillQuaternary,
      transform: 'scale(1.02)',
    },
  },

  zxHostProfileContentCollapsed: {
    padding: token.paddingXS + 4,
    justifyContent: 'center',
    width: '52px',
    height: '52px',
  },

  zxHostSearchContainer: {
    padding: '0',
    flex: 1,
  },

  zxHostSearchInput: {
    borderRadius: '12px',
    height: '36px',
    fontSize: '13px',
    border: 'none',
    boxShadow: `0 2px 4px rgba(0, 0, 0, 0.08)`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      boxShadow: `0 4px 8px rgba(0, 0, 0, 0.12)`,
    },
    '&:focus': {
      boxShadow: `0 4px 12px ${token.colorPrimary}20`,
    },
  },
});
