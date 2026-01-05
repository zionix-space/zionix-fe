// CSS-in-JS styles with zx-host prefix for module federation isolation
export const useStyles = (token) => ({
  zxHostSidebarContainer: {
    background: token.colorBgLayout, // Same as page background - unified shell
    height: 'calc(100vh - 48px)', // Match new topbar height
    position: 'fixed',
    top: '48px', // Match new topbar height
    insetInlineStart: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    userSelect: 'none',
    borderRight: 'none', // No borders - premium feel
  },

  zxHostSidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 48px)', // Match new topbar height
    userSelect: 'none',
    overflow: 'hidden',
  },

  zxHostMainContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'thin',
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },

  zxHostToggleContainer: {
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    padding: `${token.paddingSM}px ${token.paddingSM}px`,
    minHeight: '56px', // More breathing room
    gap: `${token.paddingSM}px`,
    backgroundColor: 'transparent', // Same as shell background
  },

  // New Finora-style top section - compact spacing
  zxHostTopSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Reduced spacing
    padding: `${token.paddingSM}px ${token.paddingSM}px`,
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

  // Single capsule container for theme buttons - Finora style
  // flexDirection is set dynamically: 'column' when collapsed, 'row' when expanded
  zxHostThemeCapsule: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    padding: '4px',
    backgroundColor: token.colorBgContainer,
    borderRadius: '12px',
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    width: 'fit-content',
  },

  zxHostThemeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%', // Perfect circle
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    color: token.colorTextSecondary,
  },

  zxHostThemeButtonActive: {
    backgroundColor: token.colorPrimary,
    color: token.colorWhite,
    boxShadow: `0 2px 4px ${token.colorPrimary}30`,
  },

  zxHostToggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: token.colorBgContainer,
    border: 'none', // No borders - soft shadow only
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    transition: `all ${token.motionDurationMid} cubic-bezier(0.4, 0, 0.2, 1)`,
    position: 'relative',
    flexShrink: 0,
  },

  zxHostToggleButtonHover: {
    backgroundColor: token.colorBgContainer,
    transform: 'scale(1.05)',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
  },

  zxHostToggleIcon: {
    fontSize: '16px',
    color: token.colorText,
  },

  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },

  zxHostSectionHeader: {
    padding: '12px 16px 6px 16px',
    fontSize: '11px',
    fontWeight: 500,
    color: token.colorTextTertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    userSelect: 'none',
    marginTop: '8px',
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
    userSelect: 'none',
    marginBottom: '12px',
    padding: '8px', // Capsule padding
    backgroundColor: token.colorBgContainer, // Capsule background
    borderRadius: '16px', // Soft rounded capsule
    margin: '0 12px 12px 12px', // Spacing from edges
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`, // Soft shadow
    border: 'none', // No borders
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
    userSelect: 'none',
  },

  zxHostProfileContainerCollapsed: {
    padding: `${token.paddingSM}px ${token.paddingXS}px`,
  },

  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderRadius: '12px',
    backgroundColor: token.colorBgContainer,
    border: 'none', // No borders
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    transition: `all ${token.motionDurationMid} cubic-bezier(0.4, 0, 0.2, 1)`,
    justifyContent: 'flex-start',
  },

  zxHostProfileContentCollapsed: {
    padding: token.paddingXS,
    justifyContent: 'center',
  },

  zxHostProfileContentHover: {
    backgroundColor: token.colorBgContainer,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
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
  },

  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: 1.2,
  },

  zxHostProfileMore: {
    color: token.colorTextTertiary,
    fontSize: '16px',
    marginLeft: 'auto',
  },

  zxHostProfileCollapsed: {
    padding: `${token.paddingSM}px`,
    borderTop: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  zxHostProfileExpanded: {
    padding: `${token.paddingSM}px`,
    borderTop: 'none',
    backgroundColor: 'transparent',
  },

  zxHostSearchContainer: {
    padding: `0 ${token.paddingXS}px`,
    flex: 1,
  },

  zxHostSearchInput: {
    borderRadius: '12px',
    height: '36px',
    fontSize: '13px',
    border: 'none', // No borders
    backgroundColor: token.colorBgContainer,
    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: token.colorBgContainer,
      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
    },
    '&:focus': {
      backgroundColor: token.colorBgContainer,
      boxShadow: `0 0 0 3px ${token.colorPrimary}15, 0 4px 12px rgba(0, 0, 0, 0.1)`,
    },
  },
});
