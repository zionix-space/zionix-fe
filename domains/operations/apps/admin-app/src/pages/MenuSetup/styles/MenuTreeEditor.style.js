// MenuTreeEditor styles - Following Ant Design tokens
export const useStyles = (token) => ({
  editorContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: token.colorBgContainer,
  },

  editorHeader: {
    padding: `${token.paddingSM}px ${token.padding}px`,
    borderBottom: `1px solid ${token.colorBorder}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: token.colorFillQuaternary,
  },

  headerLeft: {
    flex: 1,
  },

  headerRight: {
    flexShrink: 0,
  },

  editorTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: token.colorText,
  },

  editorSubtitle: {
    fontSize: '12px',
    color: token.colorTextSecondary,
    marginTop: '2px',
    display: 'block',
  },

  treeContainer: {
    flex: 1,
    padding: token.padding,
    overflow: 'auto',
    // Firefox scrollbar styling
    scrollbarWidth: 'thin',
    scrollbarColor: `${token.colorBorderSecondary} transparent`,
  },

  treeStyle: {
    backgroundColor: 'transparent',
    fontSize: '14px',
    
    '& .ant-tree-node-content-wrapper': {
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      borderRadius: token.borderRadiusSM,
      transition: 'all 0.2s ease',
      minHeight: '32px',
      display: 'flex',
      alignItems: 'center',
    },
    
    '& .ant-tree-node-content-wrapper:hover': {
      backgroundColor: token.colorFillQuaternary,
    },
    
    '& .ant-tree-node-content-wrapper.ant-tree-node-selected': {
      backgroundColor: token.colorPrimary,
      color: token.colorWhite,
    },
    
    '& .ant-tree-title': {
      width: '100%',
    },
    
    '& .ant-tree-switcher': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    '& .ant-tree-draggable-icon': {
      color: token.colorTextTertiary,
      fontSize: '12px',
      marginRight: token.paddingXS,
    },
  },

  treeNodeTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: `${token.paddingXXS}px 0`,
  },

  actionButton: {
    opacity: 0,
    transition: 'opacity 0.2s ease',
    color: token.colorTextTertiary,
    
    '&:hover': {
      color: token.colorText,
      backgroundColor: token.colorFillSecondary,
    },
  },

  // Show action button on hover
  treeNodeTitle: {
    '&:hover .ant-btn': {
      opacity: 1,
    },
  },

  disabledIcon: {
    color: token.colorTextTertiary,
    fontSize: '12px',
  },

  readonlyIcon: {
    color: token.colorWarning,
    fontSize: '12px',
  },

  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    textAlign: 'center',
  },

  modalForm: {
    marginTop: token.padding,
  },

  // Custom styles for tree node actions
  '.ant-tree-node-content-wrapper:hover .tree-node-actions': {
    opacity: 1,
  },
});