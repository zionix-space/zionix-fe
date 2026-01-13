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
        padding: '2px 0',
    },

    treeNodeIcon: {
        fontSize: '16px',
        color: token.colorTextSecondary,
        flexShrink: 0,
    },

    treeNodeLabel: {
        flex: 1,
        fontSize: '13px',
        fontWeight: 500,
        color: token.colorText,
    },

    treeNodeBadge: {
        flexShrink: 0,
        marginLeft: 'auto',
    },
});
