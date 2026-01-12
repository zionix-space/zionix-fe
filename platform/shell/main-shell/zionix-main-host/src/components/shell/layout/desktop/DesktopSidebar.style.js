// CSS-in-JS styles with zx-host prefix for module federation isolation
export const useStyles = (token, isDarkMode = false) => ({
  zxHostSidebarContainer: {
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.015)' // Ultra-subtle in dark mode
      : 'rgba(0, 0, 0, 0.015)', // Ultra-subtle in light mode
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    height: 'calc(100vh - 52px)',
    position: 'fixed',
    top: '52px',
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
    minHeight: 'calc(100vh - 52px)', // Match new topbar height
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
    // Note: Webkit scrollbar styling is handled in injected CSS
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

  // top section - ultra-compact Apple premium design
  zxHostTopSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px 12px',
    borderBottom: 'none',
    userSelect: 'none',
  },

  // Controls layout - hamburger + theme toggle in single row
  zxHostControlsExpanded: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '6px',
  },

  zxHostControlsCollapsed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },

  // Compact theme capsule for EXPANDED mode only
  zxHostThemeCapsule: {
    display: 'flex',
    gap: '2px',
    justifyContent: 'center',
    padding: '3px',
    background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '10px',
    boxShadow: `
      0 1px 3px 0 rgba(0, 0, 0, 0.08),
      inset 0 0 0 0.5px ${token.colorBorder}20
    `,
    width: 'fit-content',
    border: `0.5px solid ${token.colorBorder}15`,
  },

  // Larger theme capsule for COLLAPSED mode - maintains original size
  zxHostThemeCapsuleCollapsed: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
    padding: '6px',
    background: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
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

  // Compact button for EXPANDED mode
  zxHostThemeButton: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    color: token.colorTextSecondary,
    fontSize: '16px',
    fontWeight: 500,
    opacity: 0.6,
    position: 'relative',
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
      opacity: 0.9,
    },
  },

  // Larger button for COLLAPSED mode - maintains original size
  zxHostThemeButtonCollapsed: {
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
    opacity: 0.75,
    position: 'relative',
    '&:hover': {
      backgroundColor: token.colorFillQuaternary,
      transform: 'scale(1.08)',
      opacity: 1,
    },
  },

  zxHostThemeButtonActive: {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : token.colorPrimaryBg,
    color: isDarkMode ? token.colorBgContainer : token.colorPrimary,
    opacity: 1,
    boxShadow: `0 1px 2px rgba(0, 0, 0, 0.1)`,
  },

  zxHostThemeButtonActiveCollapsed: {
    backgroundImage: 'none',
    backgroundColor: token.colorPrimaryBg,
    color: token.colorPrimary,
    opacity: 1,
    boxShadow: 'none',
    transform: 'scale(1.05)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '3px',
      height: '60%',
      background: token.colorPrimary,
      borderRadius: '0 3px 3px 0',
    },
  },

  // Premium Apple-style hamburger toggle - Clean solid button
  zxHostToggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    border: 'none',
    boxShadow: 'none',
    transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`,
    position: 'relative',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },

  zxHostToggleButtonHover: {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    transform: 'scale(1.05)',
  },

  zxHostToggleIcon: {
    fontSize: '18px',
    fontWeight: 500,
    color: token.colorText,
    opacity: 0.75,
    transition: 'all 0.2s ease',
  },

  zxHostToggleIconHover: {
    color: token.colorText,
    opacity: 1,
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
    opacity: 0.55,
  },

  zxHostSectionHeaderCollapsed: {
    height: token.padding,
    marginTop: token.paddingSM,
    marginBottom: token.paddingSM,
    marginLeft: 0,
    marginRight: 0,
  },

  zxHostSectionDivider: {
    flex: 1,
    height: '1px',
    opacity: 0,
  },

  zxHostMenuContainer: {
    userSelect: 'none',
    padding: '8px',
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.08)' // More opaque for better readability in dark mode
      : 'rgba(255, 255, 255, 0.75)', // Clear white background with mild opacity in light mode
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: '18px',
    marginTop: 0,
    marginBottom: '8px',
    marginLeft: '12px',
    marginRight: '12px',
    boxShadow: isDarkMode
      ? `
        0 4px 12px 0 rgba(0, 0, 0, 0.3),
        0 1px 3px 0 rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px ${token.colorBorder}60,
        inset 0 1px 0 0 ${token.colorBgElevated}40
      `
      : `
        0 2px 8px 0 rgba(0, 0, 0, 0.08),
        0 1px 2px 0 rgba(0, 0, 0, 0.04),
        inset 0 0 0 1px ${token.colorBorder}50,
        inset 0 1px 0 0 rgba(255, 255, 255, 0.8)
      `,
    border: `1px solid ${isDarkMode ? token.colorBorder + '40' : token.colorBorder + '30'}`,
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
    marginTop: 0,
    marginBottom: '12px',
    marginLeft: '12px',
    marginRight: '12px',
  },

  zxHostProfileExpanded: {
    padding: '0',
    borderTop: 'none',
    backgroundColor: 'transparent',
    marginTop: 0,
    marginBottom: '12px',
    marginLeft: '12px',
    marginRight: '12px',
  },

  zxHostProfileContent: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: `${token.paddingXS + 2}px ${token.paddingSM}px`,
    borderRadius: '18px',
    background: isDarkMode
      ? 'rgba(255, 255, 255, 0.08)' // More opaque for better readability in dark mode
      : 'rgba(255, 255, 255, 0.75)', // Clear white background with mild opacity in light mode
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: `1px solid ${isDarkMode ? token.colorBorder + '40' : token.colorBorder + '30'}`,
    boxShadow: isDarkMode
      ? `
        0 4px 12px 0 rgba(0, 0, 0, 0.3),
        0 1px 3px 0 rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px ${token.colorBorder}60,
        inset 0 1px 0 0 ${token.colorBgElevated}40
      `
      : `
        0 2px 8px 0 rgba(0, 0, 0, 0.08),
        0 1px 2px 0 rgba(0, 0, 0, 0.04),
        inset 0 0 0 1px ${token.colorBorder}50,
        inset 0 1px 0 0 rgba(255, 255, 255, 0.8)
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

  // Ultra-compact search - Apple Spotlight style
  zxHostSearchInput: {
    borderRadius: '8px',
    height: '32px',
    fontSize: '13px',
    border: 'none',
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    boxShadow: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    },
    '&:focus': {
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : token.colorBgContainer,
      boxShadow: `0 0 0 2px ${token.colorPrimary}20`,
    },
  },
});
