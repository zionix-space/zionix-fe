// CSS-in-JS styles for Menu Sidebar - Theme-aware
export const useStyles = (token, isDarkMode = false) => {
    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    return {
        sidebarContainer: {
            background: getLightPrimaryBg(),
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
            borderRight: 'none',
            boxShadow: 'none',
        },

        sidebarContent: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            userSelect: 'none',
            overflow: 'hidden',
        },

        mainContent: {
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
        },

        menuContainer: {
            userSelect: 'none',
            padding: '8px',
            background: token.colorBgContainer,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '18px',
            marginTop: 0,
            marginBottom: '8px',
            marginLeft: '12px',
            marginRight: '12px',
            boxShadow: token.boxShadowSecondary,
            border: `1px solid ${token.colorBorderSecondary}`,
        },

        sectionHeader: {
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

        sectionHeaderCollapsed: {
            height: token.padding,
            marginTop: token.paddingSM,
            marginBottom: token.paddingSM,
            marginLeft: 0,
            marginRight: 0,
        },
    };
};
