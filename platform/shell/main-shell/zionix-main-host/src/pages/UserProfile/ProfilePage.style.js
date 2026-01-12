export const useStyles = (token, isDarkMode) => ({
    container: {
        padding: '24px',
        minHeight: '100vh',
        background: token.colorBgLayout, // Use theme-based background
    },

    // Profile Card (Left Sidebar)
    profileCard: {
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        boxShadow: token.boxShadow,
        padding: '32px 24px',
        textAlign: 'center',
        border: `1px solid ${token.colorBorderSecondary}`,
    },

    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },

    avatarGradientBorder: {
        padding: '3px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)',
        display: 'inline-block',
    },

    avatar: {
        border: `3px solid ${token.colorBgContainer}`,
    },

    userInfo: {
        marginBottom: '20px',
    },

    userName: {
        fontSize: '18px',
        fontWeight: 600,
        color: token.colorText,
        margin: '0 0 4px 0',
        lineHeight: 1.4,
    },

    userNickname: {
        fontSize: '13px',
        color: token.colorTextSecondary,
        margin: 0,
        fontWeight: 400,
    },

    progressContainer: {
        marginBottom: '28px',
        padding: '0 12px',
    },

    progressLabel: {
        fontSize: '11px',
        color: token.colorTextSecondary,
        marginTop: '8px',
        marginBottom: 0,
        fontWeight: 400,
    },

    menu: {
        background: 'transparent',
        border: 'none',
        fontSize: '14px',
    },

    // Content Card (Right Side)
    contentCard: {
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
        boxShadow: token.boxShadow,
        padding: '40px',
        minHeight: '600px',
        border: `1px solid ${token.colorBorderSecondary}`,
    },

    sectionTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: token.colorText,
        marginBottom: '24px',
        marginTop: '0',
        paddingBottom: '0',
        borderBottom: 'none',
    },

    formLabel: {
        fontSize: '12px',
        fontWeight: 500,
        color: token.colorTextSecondary,
        marginBottom: '8px',
    },

    verifiedBadge: {
        color: token.colorSuccess,
        fontSize: '11px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },

    actionButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '40px',
        paddingTop: '0',
        borderTop: 'none',
    },

    cancelButton: {
        minWidth: '100px',
    },

    saveButton: {
        minWidth: '120px',
    },

    placeholderText: {
        color: token.colorTextSecondary,
        fontSize: '14px',
        textAlign: 'center',
        padding: '40px 0',
    },

    // Responsive adjustments
    '@media (max-width: 768px)': {
        container: {
            padding: '16px',
        },
        contentCard: {
            padding: '24px',
        },
        profileCard: {
            marginBottom: '16px',
            padding: '24px 20px',
        },
        actionButtons: {
            flexDirection: 'column',
            gap: '8px',
        },
        cancelButton: {
            width: '100%',
        },
        saveButton: {
            width: '100%',
        },
    },
});
