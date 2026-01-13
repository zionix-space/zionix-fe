export const useStyles = (token, isDarkMode) => ({
    popoverContent: {
        width: '100%',
    },
    searchInput: {
        marginBottom: 12,
    },
    iconGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
        maxHeight: 300,
        overflowY: 'auto',
        padding: 4,
        marginBottom: 12,
    },
    iconItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorBorder}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: token.colorBgTextHover,
        ':hover': {
            borderColor: token.colorPrimary,
            backgroundColor: token.colorBgTextActive,
        },
    },
    iconItemSelected: {
        borderColor: token.colorPrimary,
        backgroundColor: token.colorPrimaryBg,
    },
    iconPreview: {
        fontSize: 20,
        color: token.colorText,
    },
    noResults: {
        textAlign: 'center',
        padding: 20,
        color: token.colorTextSecondary,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 8,
        borderTop: `1px solid ${token.colorBorder}`,
    },
});
