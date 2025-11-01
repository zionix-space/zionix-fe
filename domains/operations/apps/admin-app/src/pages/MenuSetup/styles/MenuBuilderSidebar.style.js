// MenuBuilderSidebar styles - Following existing DesktopSidebar patterns
export const useStyles = (token) => ({
  sidebarContainer: {
    background: token.colorBgContainer,
    height: 'calc(100vh - 64px)',
    borderRight: `1px solid ${token.colorBorder}`,
    overflow: 'hidden',
    userSelect: 'none',
  },

  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },

  sidebarHeader: {
    padding: `${token.paddingSM}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '48px',
    gap: `${token.paddingSM}px`,
  },

  sidebarTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: token.colorText,
  },

  addButton: {
    height: '28px',
    fontSize: '12px',
    borderRadius: token.borderRadiusSM,
  },

  searchContainer: {
    padding: `${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },

  searchInput: {
    borderRadius: token.borderRadiusSM,
    height: '32px',
    fontSize: '13px',
    border: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    transition: 'all 0.2s ease',
    '&:focus': {
      borderColor: token.colorPrimary,
      backgroundColor: token.colorBgContainer,
    },
  },

  menuContainer: {
    flex: 1,
    overflow: 'auto',
    padding: `${token.paddingXS}px 0`,
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },

  menuStyle: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    
    '& .antMenuItem': {
      margin: `2px ${token.paddingXS}px`,
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      height: '32px',
      lineHeight: '20px',
      borderRadius: token.borderRadiusSM,
      transition: 'all 0.2s ease',
      color: token.colorTextSecondary,
    },
    
    '& .antMenuItem:hover': {
      backgroundColor: token.colorFillQuaternary,
      color: token.colorText,
    },
    
    '& .antMenuItemSelected': {
      backgroundColor: token.colorPrimary,
      color: token.colorWhite,
    },
    
    '& .antMenuItemSelected::after': {
      display: 'none',
    },
    
    '& .antMenuSubmenu': {
      '& .antMenuSubmenuTitle': {
        margin: `2px ${token.paddingXS}px`,
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        height: '32px',
        lineHeight: '20px',
        borderRadius: token.borderRadiusSM,
        transition: 'all 0.2s ease',
        color: token.colorTextSecondary,
      },
      
      '&:hover .antMenuSubmenuTitle': {
        backgroundColor: token.colorFillQuaternary,
        color: token.colorText,
      },
    },
    
    '& .antMenuItemGroupTitle': {
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      fontSize: '11px',
      fontWeight: 500,
      color: token.colorTextTertiary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginTop: token.paddingXS,
    },
  },

  footerInfo: {
    padding: `${token.paddingSM}px`,
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    backgroundColor: token.colorFillQuaternary,
    marginTop: 'auto',
  },

  infoText: {
    fontSize: '11px',
    color: token.colorTextTertiary,
    display: 'block',
  },
});