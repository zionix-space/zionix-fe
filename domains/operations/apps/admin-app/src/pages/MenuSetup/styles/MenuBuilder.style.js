// MenuBuilder styles - Following Ant Design tokens and existing patterns
export const useStyles = (token) => ({
  layoutContainer: {
    height: '100vh',
    width: '100%',
    background: token.colorBgLayout,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  topControls: {
    flexShrink: 0,
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorder}`,
    padding: '8px 16px',
  },

  spaceContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },

  deviceIcon: {
    fontSize: '18px',
    color: token.colorTextSecondary,
    cursor: 'pointer',
    padding: '8px',
    borderRadius: token.borderRadiusSM,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: token.colorPrimary,
      backgroundColor: token.colorFillQuaternary,
    },
  },

  mainContent: {
    flex: 1,
    background: token.colorBgLayout,
    overflow: 'hidden',
    minHeight: 0, // Important for flex child to shrink
  },

  contentContainer: {
    display: 'flex',
    height: '100%',
    gap: '1px', // Minimal gap for visual separation
  },

  editorSection: {
    flex: 1,
    minWidth: '400px',
    background: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBorder}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  previewSection: {
    flex: 1,
    minWidth: '400px',
    background: token.colorBgLayout,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // Responsive adjustments
  '@media (max-width: 1200px)': {
    contentContainer: {
      flexDirection: 'column',
    },

    editorSection: {
      minWidth: 'auto',
      borderRight: 'none',
      borderBottom: `1px solid ${token.colorBorder}`,
      flex: '0 0 50%',
    },

    previewSection: {
      minWidth: 'auto',
      flex: '0 0 50%',
    },
  },
});
