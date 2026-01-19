import { useLayoutEffect, useState } from 'react';
import { Tree, Badge, theme, Radio, Space, Tooltip, message } from 'antd';
import { useStyles } from './RoleTree.style';

const { useToken } = theme;

// Permission states
const PERMISSION_STATES = {
    DISABLED: 'disabled',
    READONLY: 'readonly',
    FULLACCESS: 'fullaccess',
};

const RoleTree = ({
    treeData,
    selectedKey,
    expandedKeys,
    searchValue,
    onSelect,
    onExpand,
    onDrop,
    onPermissionChange, // New callback for permission changes
    permissions = {}, // Object mapping node keys to permission states
}) => {
    const { token } = useToken();

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    // Inject minimal CSS for theme-aware tree selection color with reduced opacity
    useLayoutEffect(() => {
        const styleId = 'menu-tree-theme-styles';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .menu-editor-tree .ant-tree-node-selected .ant-tree-node-content-wrapper {
                background: ${token.colorPrimaryBg} !important;
            }
            
            .menu-editor-tree .ant-tree-node-selected .ant-tree-node-content-wrapper:hover {
                background: ${token.colorPrimaryBgHover} !important;
            }
            
            /* Reduce opacity of selected radio button */
            .menu-editor-tree .ant-radio-button-wrapper-checked {
                background-color: ${token.colorPrimary} !important;
                opacity: 0.75 !important;
            }
            
            .menu-editor-tree .ant-radio-button-wrapper-checked:hover {
                opacity: 0.85 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const styleToRemove = document.getElementById(styleId);
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, [token]);

    // Get parent permission for a node
    const getParentPermission = (nodeKey) => {
        // Find parent by traversing tree data
        const findParent = (items, targetKey, parentKey = null) => {
            for (const item of items) {
                if (item.key === targetKey) {
                    return parentKey;
                }
                if (item.children && item.children.length > 0) {
                    const found = findParent(item.children, targetKey, item.key);
                    if (found !== null) return found;
                }
            }
            return null;
        };

        const parentKey = findParent(treeData, nodeKey);
        return parentKey ? permissions[parentKey] : null;
    };

    // Check if a permission is allowed based on parent
    const isPermissionAllowed = (nodeKey, permission) => {
        const parentPermission = getParentPermission(nodeKey);
        if (!parentPermission) return true; // Root level, all allowed

        // Permission hierarchy: disabled < readonly < fullaccess
        const hierarchy = {
            disabled: 0,
            readonly: 1,
            fullaccess: 2
        };

        return hierarchy[permission] <= hierarchy[parentPermission];
    };

    // Handle permission change for a node
    const handlePermissionChange = (nodeKey, value) => {
        // Check if this permission is allowed based on parent
        if (!isPermissionAllowed(nodeKey, value)) {
            message.warning('Cannot set higher permission than parent. Please update parent first.');
            return;
        }

        if (onPermissionChange) {
            onPermissionChange(nodeKey, value, true); // true = cascade to children
        }
    };

    // Custom title renderer
    const renderTitle = (nodeData) => {
        const { title, icon, key } = nodeData;
        const currentPermission = permissions[key] || PERMISSION_STATES.DISABLED;
        const parentPermission = getParentPermission(key);

        const highlightText = (text) => {
            if (!searchValue || !text) return text;
            const index = text.toLowerCase().indexOf(searchValue.toLowerCase());
            if (index === -1) return text;

            const beforeStr = text.substring(0, index);
            const matchStr = text.substring(index, index + searchValue.length);
            const afterStr = text.substring(index + searchValue.length);

            return (
                <>
                    {beforeStr}
                    <span style={{ backgroundColor: token.colorWarningBg, color: token.colorWarning }}>
                        {matchStr}
                    </span>
                    {afterStr}
                </>
            );
        };

        return (
            <div style={styles.treeNodeTitle}>
                {icon && <i className={icon} style={styles.treeNodeIcon} />}
                <span style={styles.treeNodeLabel}>{highlightText(title)}</span>
                <div style={styles.permissionControl} onClick={(e) => e.stopPropagation()}>
                    <Radio.Group
                        value={currentPermission}
                        onChange={(e) => handlePermissionChange(key, e.target.value)}
                        size="small"
                        buttonStyle="solid"
                    >
                        <Tooltip title="Disabled">
                            <Radio.Button
                                value={PERMISSION_STATES.DISABLED}
                                style={styles.radioButton}
                            >
                                <i className="ri-close-circle-line" style={{
                                    color: currentPermission === PERMISSION_STATES.DISABLED ? '#fff' : token.colorError,
                                    fontSize: '14px'
                                }} />
                            </Radio.Button>
                        </Tooltip>
                        <Tooltip title={!isPermissionAllowed(key, PERMISSION_STATES.READONLY) ? 'Parent must be Read Only or Full Access' : 'Read Only'}>
                            <Radio.Button
                                value={PERMISSION_STATES.READONLY}
                                style={styles.radioButton}
                                disabled={!isPermissionAllowed(key, PERMISSION_STATES.READONLY)}
                            >
                                <i className="ri-lock-line" style={{
                                    color: currentPermission === PERMISSION_STATES.READONLY ? '#fff' : token.colorWarning,
                                    fontSize: '14px'
                                }} />
                            </Radio.Button>
                        </Tooltip>
                        <Tooltip title={!isPermissionAllowed(key, PERMISSION_STATES.FULLACCESS) ? 'Parent must be Full Access' : 'Full Access'}>
                            <Radio.Button
                                value={PERMISSION_STATES.FULLACCESS}
                                style={styles.radioButton}
                                disabled={!isPermissionAllowed(key, PERMISSION_STATES.FULLACCESS)}
                            >
                                <i className="ri-lock-unlock-line" style={{
                                    color: currentPermission === PERMISSION_STATES.FULLACCESS ? '#fff' : token.colorSuccess,
                                    fontSize: '14px'
                                }} />
                            </Radio.Button>
                        </Tooltip>
                    </Radio.Group>
                </div>
            </div>
        );
    };

    const transformedTreeData = (data) => {
        if (!data || !Array.isArray(data)) return [];
        return data.map((node) => ({
            ...node,
            title: renderTitle(node),
            children: node.children && node.children.length > 0 ? transformedTreeData(node.children) : [],
        }));
    };

    return (
        <div style={styles.treeContainer} className="menu-editor-scrollbar">
            <Tree
                className="menu-editor-tree"
                treeData={transformedTreeData(treeData)}
                selectedKeys={selectedKey ? [selectedKey] : []}
                expandedKeys={expandedKeys}
                onSelect={(keys) => onSelect(keys.length > 0 ? keys[0] : null)}
                onExpand={onExpand}
                onDrop={onDrop}
                draggable
                blockNode
                showIcon={false}
            />
        </div>
    );
};

export default RoleTree;
