export const useStyles = (token, isDarkMode) => ({
    container: {
        padding: '24px',
        minHeight: '100vh',
        background: token.colorBgLayout, // Use theme-based background
    },

    // Profile Card (Left Sidebar)
    profileCard: {
        borderRadius: '16px',
        background: isDarkMode
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: isDarkMode
            ? '0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
        padding: '32px 24px',
        textAlign: 'center',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
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
        borderRadius: '16px',
        background: isDarkMode
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: isDarkMode
            ? '0 4px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 2px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
        padding: '40px',
        minHeight: '600px',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
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
            padding: '12px',
            background: token.colorBgLayout,
        },
        contentCard: {
            padding: '20px 16px',
            borderRadius: '12px',
            minHeight: 'auto',
        },
        profileCard: {
            marginBottom: '12px',
            padding: '24px 16px',
            borderRadius: '12px',
        },
        actionButtons: {
            flexDirection: 'column',
            gap: '12px',
            marginTop: '32px',
            position: 'sticky',
            bottom: '12px',
            background: isDarkMode
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '16px',
            margin: '32px -16px -20px -16px',
            borderRadius: '0 0 12px 12px',
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
        },
        cancelButton: {
            width: '100%',
            height: '44px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
        },
        saveButton: {
            width: '100%',
            height: '44px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '20px',
        },
        userName: {
            fontSize: '20px',
            fontWeight: 700,
        },
        avatarGradientBorder: {
            padding: '4px',
        },
    },
});
