export const useStyles = (token, isDarkMode = false) => ({
    toolbarContainer: {
        paddingBottom: '12px',
        marginBottom: '12px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorFillAlter,
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '16px',
    },

    singleRow: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
    },

    searchInput: {
        width: '180px',
        borderRadius: '20px',
    },

    spacer: {
        flex: 1,
    },

    capsuleContainer: {
        display: 'inline-flex',
        gap: '2px',
        padding: '2px',
        background: token.colorBgContainer,
        borderRadius: '20px',
        border: `1px solid ${token.colorBorderSecondary}`,
    },
});
