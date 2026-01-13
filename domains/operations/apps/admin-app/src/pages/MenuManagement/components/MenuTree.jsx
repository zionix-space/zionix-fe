import { useLayoutEffect } from 'react';
import { Tree, Badge, theme } from 'antd';
import { useStyles } from './MenuTree.style';

const { useToken } = theme;

const MenuTree = ({
    treeData,
    selectedKey,
    expandedKeys,
    searchValue,
    onSelect,
    onExpand,
    onDrop,
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

    // Inject minimal CSS for theme-aware tree selection color
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
        `;
        document.head.appendChild(style);

        return () => {
            const styleToRemove = document.getElementById(styleId);
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, [token]);

    // Custom title renderer
    const renderTitle = (nodeData) => {
        const { title, icon, badge } = nodeData;

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
                {badge && (
                    <span style={styles.treeNodeBadge}>
                        {typeof badge === 'string' ? (
                            <Badge count={badge} style={{ backgroundColor: token.colorPrimary }} />
                        ) : (
                            <Badge count={badge.count} style={{ backgroundColor: token.colorPrimary }} />
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

export default MenuTree;
