// AdminTopBar styles - Theme-aware
export const useStyles = (token, isDarkMode = false) => {
    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    return {
        topBarStyle: {
            background: getLightPrimaryBg(),
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: 'none',
            boxShadow: 'none',
            padding: "0 20px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            userSelect: "none",
        },

        leftSectionStyle: {
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: "24px",
            justifyContent: "center",
        },

        brandContainerStyle: {
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            userSelect: "none",
            position: "absolute",
            left: "20px",
            height: "100%",
        },

        logoTextStyle: {
            fontSize: "16px",
            fontWeight: "600",
            color: token.colorText,
            letterSpacing: "0",
            userSelect: "none",
            opacity: 0.85,
        },

        rightActionsStyle: {
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            flexShrink: 0,
            userSelect: "none",
            background: token.colorBgContainer,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: "8px",
            padding: "2px",
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: 'none',
            height: "32px",
            position: "absolute",
            right: "20px",
        },

        navigationContainerStyle: {
            display: "inline-flex",
            alignItems: "center",
            flexShrink: 1,
            minWidth: 0,
            width: "600px", // Fixed width to trigger overflow
            maxWidth: "calc(100vw - 500px)",
            background: token.colorBgContainer,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: "8px",
            padding: "2px",
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: 'none',
            height: "32px",
        },

        menuStyle: {
            background: "transparent",
            border: "none",
            display: "inline-flex",
            alignItems: "center",
            lineHeight: "normal",
            minWidth: 0,
            flex: 1,
        },

        iconButtonStyle: {
            border: "none",
            background: "transparent",
            color: token.colorText,
            fontSize: "15px",
            fontWeight: 500,
            opacity: 0.6,
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            userSelect: "none",
            flexShrink: 0,
        },
    };
};
