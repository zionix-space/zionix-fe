import { useLayoutEffect } from 'react';
import { BaseTree, BaseBadge, BaseCheckbox, theme } from '@zionix-space/design-system';
import './RoleTree.scss';

const { useToken } = theme;

const RoleTree = ({
    treeData,
    selectedKey,
    expandedKeys,
    searchValue,
    onSelect,
    onExpand,
    onDrop,
    accessLevels,
    onAccessChange,
    menuData, // Need this to find parent access levels
}) => {
    const { token } = useToken();

    // Helper function to find parent access level
    const getParentAccess = (nodeKey) => {
        if (!menuData?.mainNavigation) return 'full'; // Default to full if no parent

        const findParent = (items, targetKey, parentAccess = 'full') => {
            for (const item of items) {
                const itemId = item.key || item.menu_id || item.application_id || item.module_id;

                if (item.children && item.children.length > 0) {
                    // Check if target is a direct child
                    const isDirectChild = item.children.some(child => {
                        const childId = child.key || child.menu_id || child.application_id || child.module_id;
                        return childId === targetKey;
                    });

                    if (isDirectChild) {
                        return accessLevels[itemId] || 'full';
                    }

                    // Recursively search in children
                    const result = findParent(item.children, targetKey, accessLevels[itemId] || 'full');
                    if (result !== 'full' || result !== null) return result;
                }
            }
            return null;
        };

        const parentAccess = findParent(menuData.mainNavigation, nodeKey);
        return parentAccess || 'full'; // Default to full if no parent found
    };

    // Inject minimal CSS for theme-aware BaseTree selection color
    useLayoutEffect(() => {
        const styleId = 'role-tree-theme-styles';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .BaseMenu-editor-BaseTree .ant-BaseTree-node-selected .ant-BaseTree-node-content-wrapper {
                background: ${token.colorPrimaryBg} !important;
            }
            
            .BaseMenu-editor-BaseTree .ant-BaseTree-node-selected .ant-BaseTree-node-content-wrapper:hover {
                background: ${token.colorPrimaryBgHover} !important;
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

    // Custom title renderer with checkboxes (Strict Inheritance)
    const renderTitle = (nodeData) => {
        const { title, icon, badge, key } = nodeData;
        const currentAccess = accessLevels?.[key] || 'disabled';
        const parentAccess = getParentAccess(key);

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

        const handleCheckboxChange = (access, checked) => {
            if (onAccessChange) {
                if (checked) {
                    // Checking a checkbox: set that access level and cascade to children
                    onAccessChange(key, access, true); // cascade = true
                } else {
                    // Unchecking: only uncheck if it's currently selected
                    if (currentAccess === access) {
                        onAccessChange(key, 'disabled', true); // cascade = true
                    }
                }
            }
        };

        // Strict Inheritance: Determine which checkboxes should be disabled
        const isFullAccessDisabled = parentAccess === 'read' || parentAccess === 'disabled';
        const isReadDisabled = parentAccess === 'disabled';

        return (
            <div className="role-tree-node-title">
                {icon && <i className={`${icon} role-tree-node-icon`} />}
                <span className="role-tree-node-label">{highlightText(title)}</span>

                {/* Access Level Checkboxes - Strict Inheritance */}
                <div className="role-tree-access-controls" onClick={(e) => e.stopPropagation()}>
                    <BaseCheckbox
                        checked={currentAccess === 'full'}
                        onChange={(e) => handleCheckboxChange('full', e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isFullAccessDisabled}
                    >
                        <span style={{
                            fontSize: '12px',
                            color: isFullAccessDisabled ? token.colorTextDisabled : token.colorSuccess
                        }}>
                            Full Access
                        </span>
                    </BaseCheckbox>
                    <BaseCheckbox
                        checked={currentAccess === 'read'}
                        onChange={(e) => handleCheckboxChange('read', e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isReadDisabled}
                    >
                        <span style={{
                            fontSize: '12px',
                            color: isReadDisabled ? token.colorTextDisabled : token.colorInfo
                        }}>
                            Read
                        </span>
                    </BaseCheckbox>
                    <BaseCheckbox
                        checked={currentAccess === 'disabled'}
                        onChange={(e) => handleCheckboxChange('disabled', e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span style={{ fontSize: '12px', color: token.colorTextTertiary }}>
                            Disabled
                        </span>
                    </BaseCheckbox>
                </div>

                {badge && (
                    <span className="role-tree-node-badge">
                        {typeof badge === 'string' ? (
                            <BaseBadge count={badge} style={{ backgroundColor: token.colorPrimary }} />
                        ) : (
                            <BaseBadge count={badge.count} style={{ backgroundColor: token.colorPrimary }} />
                        )}
                    </span>
                )}
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
        <div className="role-tree-container role-editor-scrollbar">
            <BaseTree
                className="role-editor-tree"
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
