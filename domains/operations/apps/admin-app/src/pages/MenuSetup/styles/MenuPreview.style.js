// MenuPreview styles - Responsive preview with device-specific layouts
export const useStyles = (token, previewMode) => {
  const getPreviewScale = () => {
    switch (previewMode) {
      case 'mobile':
        return 0.8;
      case 'tablet':
        return 0.9;
      default:
        return 1;
    }
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  const scale = getPreviewScale();
  const width = getPreviewWidth();

  return {
    previewContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: token.colorBgLayout,
      overflow: 'hidden',
    },

    previewHeader: {
      padding: `${token.paddingSM}px ${token.padding}px`,
      borderBottom: `1px solid ${token.colorBorder}`,
      backgroundColor: token.colorBgContainer,
    },

    previewTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 600,
      color: token.colorText,
    },

    previewSubtitle: {
      fontSize: '12px',
      color: token.colorTextSecondary,
      marginTop: '2px',
      display: 'block',
    },

    previewContent: {
      flex: 1,
      padding: token.padding,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto',
      backgroundColor: token.colorFillQuaternary,
    },

    previewLayout: {
      width: width,
      height: previewMode === 'mobile' ? '667px' : '100%',
      maxHeight: '800px',
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      border:
        previewMode !== 'desktop' ? `2px solid ${token.colorBorder}` : 'none',
      borderRadius: previewMode !== 'desktop' ? token.borderRadiusLG : 0,
      overflow: 'hidden',
      backgroundColor: token.colorBgContainer,
      boxShadow:
        previewMode !== 'desktop' ? '0 8px 24px rgba(0, 0, 0, 0.12)' : 'none',
    },

    topBar: {
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorder}`,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      padding: '0 16px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    topBarLeft: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      gap: previewMode === 'desktop' ? '24px' : '16px',
    },

    topBarRight: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },

    brand: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },

    brandText: {
      fontSize: previewMode === 'mobile' ? '16px' : '18px',
      fontWeight: '600',
      color: token.colorText,
      letterSpacing: '-0.01em',
    },

    mainMenu: {
      background: 'transparent',
      border: 'none',
      fontSize: '13px',
      fontWeight: 500,
      flex: 1,
      minWidth: 0,

      '& .antMenuItem': {
        padding: '0 12px',
        margin: '0 2px',
        height: '28px',
        lineHeight: '28px',
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
        fontWeight: 600,
      },

      '& .antMenuItemSelected::after': {
        display: 'none',
      },
    },

    userText: {
      fontSize: '13px',
      color: token.colorText,
      display: previewMode === 'mobile' ? 'none' : 'inline',
    },

    contentLayout: {
      height: 'calc(100% - 56px)',
    },

    sidebar: {
      background: token.colorBgContainer,
      borderRight: `1px solid ${token.colorBorder}`,
      height: '100%',
    },

    sidebarHeader: {
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
      backgroundColor: token.colorFillQuaternary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '40px',
    },

    sidebarTitle: {
      fontSize: '13px',
      color: token.colorText,
    },

    collapseButton: {
      width: '24px',
      height: '24px',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
    },

    sidebarMenu: {
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '12px',

      '& .antMenuItem': {
        margin: `1px ${token.paddingXXS}px`,
        padding: `${token.paddingXXS}px ${token.paddingSM}px`,
        height: '28px',
        lineHeight: '16px',
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
        fontWeight: 500,
      },

      '& .antMenuItemSelected::after': {
        display: 'none',
      },
    },

    mainContent: {
      background: token.colorBgLayout,
      padding: 0,
      overflow: 'auto',
    },

    contentArea: {
      padding: token.padding,
      height: '100%',
    },

    contentTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: token.colorText,
      marginBottom: token.paddingSM,
    },

    mobileMenuPreview: {
      marginTop: token.padding,
      padding: token.padding,
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadius,
      border: `1px solid ${token.colorBorder}`,
    },

    mobileMenu: {
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',

      '& .antMenuItem': {
        margin: `2px 0`,
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        height: '36px',
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
        fontWeight: 500,
      },
    },
  };
};
