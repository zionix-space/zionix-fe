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
    paddingBottom: '8px', // Consistent with 8px grid system
    paddingTop: '8px', // Add top padding for better spacing
    // Custom scrollbar styling for modern SaaS appearance
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: token.colorBorderSecondary,
      borderRadius: '3px',
      transition: 'background 0.2s ease',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: token.colorBorder,
    },
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },
  
  zxHostToggleContainer: {
    padding: `${token.paddingSM}px`, // Reduced from token.padding for more compact layout
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: token.colorFillQuaternary,
    userSelect: 'none', // Prevent text selection on toggle
    minHeight: '48px', // Ensure consistent height while reducing padding
    gap: token.paddingXS, // Add gap between search and toggle button
  },
  
  zxHostToggleButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px', // Consistent with other elements
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease', // Faster, more responsive transition
    position: 'relative',
    flexShrink: 0, // Prevent button from shrinking
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
    padding: '12px 16px 8px 16px', // Optimized spacing following 8px grid
    fontSize: '11px',
    fontWeight: 600,
    color: token.colorTextSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Consistent with 8px grid
    userSelect: 'none', // Prevent text selection on section headers
    marginTop: '8px', // Add consistent top spacing
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
    padding: '0 12px', // Optimized for 8px grid system (12px = 1.5 * 8px)
    userSelect: 'none', // Prevent text selection on menu container
    marginBottom: '8px', // Add consistent spacing between sections
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
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Reduced from token.padding
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    userSelect: 'none', // Prevent text selection on profile container
  },
  
  zxHostProfileContainerCollapsed: {
    padding: token.paddingXS, // Reduced from token.paddingSM
  },
  
  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Reduced vertical padding
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
    padding: `${token.paddingXS}px ${token.paddingSM}px`, // Reduced padding for compact look
    flex: 1,
  },
  
  zxHostSearchInput: {
    borderRadius: '6px', // Consistent with SaaS standards
    height: '32px', // Standard SaaS search bar height
    fontSize: '14px',
    border: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: token.colorBorder,
      backgroundColor: token.colorBgContainer,
    },
    '&:focus': {
      borderColor: token.colorPrimary,
      backgroundColor: token.colorBgContainer,
      boxShadow: `0 0 0 2px ${token.colorPrimary}10`,
    },
    '& .ant-input': {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '14px',
      padding: '0 8px',
    },
    '& .anticon': {
      color: token.colorTextTertiary,
      fontSize: '14px',
    },
  },
});