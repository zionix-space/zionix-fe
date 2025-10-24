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
  },
  
  zxHostSidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 'calc(100vh - 64px)',
  },
  
  zxHostMainContent: {
    flex: 1,
    overflow: 'auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: token.paddingXS,
  },
  
  zxHostToggleContainer: {
    padding: token.padding,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: token.colorFillQuaternary,
  },
  
  zxHostToggleButton: {
    width: '32px',
    height: '32px',
    borderRadius: token.borderRadius,
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
    position: 'relative',
  },
  
  zxHostToggleButtonHover: {
    backgroundColor: `${token.colorPrimary}10`,
    borderColor: `${token.colorPrimary}30`,
  },
  
  zxHostToggleIcon: {
    fontSize: '16px',
    color: token.colorTextSecondary,
    transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
  },
  
  zxHostToggleIconHover: {
    color: token.colorPrimary,
  },
  
  zxHostSectionHeader: {
    padding: `${token.padding}px ${token.padding}px ${token.paddingSM}px ${token.padding}px`,
    fontSize: '11px',
    fontWeight: 600,
    color: token.colorTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: token.paddingSM,
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
    padding: '0 8px',
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
  },
  
  zxHostProfileContainer: {
    padding: token.padding,
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
  },
  
  zxHostProfileContainerCollapsed: {
    padding: token.paddingSM,
  },
  
  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    transition: `background-color ${token.motionDurationMid} ${token.motionEaseInOut}`,
    justifyContent: 'flex-start',
  },
  
  zxHostProfileContentCollapsed: {
    padding: token.paddingXS,
    justifyContent: 'center',
  },
  
  zxHostProfileContentHover: {
    backgroundColor: token.colorFillSecondary,
  },
  
  zxHostProfileInfo: {
    marginLeft: token.padding,
    flex: 1,
  },
  
  zxHostProfileName: {
    fontWeight: 600,
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    marginBottom: '2px',
  },
  
  zxHostProfileEmail: {
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
    lineHeight: token.lineHeightSM,
  },
  
  zxHostSearchContainer: {
    padding: `${token.paddingSM}px ${token.padding}px ${token.padding}px ${token.padding}px`,
  },
  
  zxHostSearchInput: {
    borderRadius: token.borderRadius,
  },
});