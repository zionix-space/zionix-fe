// MenuBuilder styles - Following Ant Design tokens and existing patterns
export const useStyles = (token) => ({
  layoutContainer: {
    height: '100vh',
    background: token.colorBgLayout,
  },

  contentLayout: {
    height: 'calc(100vh - 64px)',
  },

  mainContent: {
    background: token.colorBgContainer,
    padding: 0,
    overflow: 'hidden',
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