export const useStyles = (token, isDarkMode = false) => ({
    formContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },

    formHeader: {
        display: 'flex',
        gap: '8px',
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '12px',
        background: token.colorFillAlter,
        border: `1px solid ${token.colorBorderSecondary}`,
    },

    form: {
        width: '100%',
        overflow: 'auto',
        paddingRight: '8px',
    },

    emptyState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '300px',
    },

    section: {
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },

    sectionTitle: {
        fontSize: '11px',
        fontWeight: 600,
        color: token.colorTextSecondary,
        marginBottom: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
});
