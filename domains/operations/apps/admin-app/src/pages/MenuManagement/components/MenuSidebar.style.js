// CSS-in-JS styles for Menu Sidebar
export const useStyles = (token, isDarkMode = false) => ({
    sidebarContainer: {
        background: isDarkMode
            ? 'rgba(255, 255, 255, 0.015)'
            : 'rgba(0, 0, 0, 0.015)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
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
        background: isDarkMode
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.75)',
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
});
