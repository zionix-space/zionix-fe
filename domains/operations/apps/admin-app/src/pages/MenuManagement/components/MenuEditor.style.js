// MenuEditor styles - Theme-aware CSS-in-JS
export const useStyles = (token, isDarkMode = false) => ({
    editorContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },

    loadingContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
    },

    twoColumnLayout: {
        display: 'flex',
        gap: '24px',
        height: 'calc(100vh - 240px)',
        overflow: 'hidden',
    },

    leftColumn: {
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: token.colorBgContainer,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '16px',
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: 'none',
        overflow: 'hidden',
    },

    rightColumn: {
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        background: token.colorBgContainer,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: 'none',
        overflow: 'auto',
        minWidth: 0,
    },

    placeholder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: token.colorTextSecondary,
        fontSize: '14px',
        opacity: 0.6,
    },
});
