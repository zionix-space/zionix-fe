export const useStyles = (token, isDarkMode = false) => ({
    treeContainer: {
        flex: 1,
        overflow: 'auto',
        padding: '12px 4px',
        marginTop: '8px',
    },

    treeNodeTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '4px 0',
    },

    treeNodeIcon: {
        fontSize: '16px',
        color: token.colorTextSecondary,
        flexShrink: 0,
    },

    treeNodeLabel: {
        flex: 1,
        fontSize: '14px',
        fontWeight: 500,
        color: token.colorText,
    },

    permissionControl: {
        flexShrink: 0,
        marginLeft: 'auto',
    },

    radioButton: {
        padding: '0 10px',
        minWidth: '36px',
        height: '28px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${token.colorBorder}`,
    },
});
