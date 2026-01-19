import { Input, Button, theme, Dropdown, Space } from 'antd';
import { useStyles } from './TreeToolbar.style';

const { Search } = Input;
const { useToken } = theme;

const TreeToolbar = ({
    searchValue,
    onSearchChange,
    onExpandAll,
    onCollapseAll,
    onSave,
    isDirty,
    saving,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onExport,
    onImport,
    onBulkPermissionChange, // New prop for bulk permission updates
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

    // Bulk permission menu items
    const bulkPermissionItems = [
        {
            key: 'fullaccess',
            label: 'Set All to Full Access',
            icon: <i className="ri-lock-unlock-line" style={{ color: token.colorSuccess }} />,
            onClick: () => onBulkPermissionChange?.('fullaccess'),
        },
        {
            key: 'readonly',
            label: 'Set All to Read Only',
            icon: <i className="ri-lock-line" style={{ color: token.colorWarning }} />,
            onClick: () => onBulkPermissionChange?.('readonly'),
        },
        {
            key: 'disabled',
            label: 'Set All to Disabled',
            icon: <i className="ri-close-circle-line" style={{ color: token.colorError }} />,
            onClick: () => onBulkPermissionChange?.('disabled'),
        },
    ];

    return (
        <div style={styles.toolbarContainer}>
            <div style={styles.singleRow}>
                <Search
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    style={styles.searchInput}
                    size="small"
                />
                <div style={styles.spacer} />
                <Dropdown menu={{ items: bulkPermissionItems }} trigger={['click']}>
                    <Button size="small" type="default" shape="round">
                        <Space size={4}>
                            Bulk Update
                            <i className="ri-arrow-down-s-line" />
                        </Space>
                    </Button>
                </Dropdown>
                <div style={styles.capsuleContainer}>
                    <Button
                        icon={<i className="ri-arrow-go-back-line" />}
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <Button
                        icon={<i className="ri-arrow-go-forward-line" />}
                        onClick={onRedo}
                        disabled={!canRedo}
                        title="Redo"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div style={styles.capsuleContainer}>
                    <Button
                        icon={<i className="ri-download-line" />}
                        onClick={onExport}
                        title="Export"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <Button
                        icon={<i className="ri-upload-line" />}
                        onClick={onImport}
                        title="Import"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div style={styles.capsuleContainer}>
                    <Button
                        icon={<i className="ri-expand-diagonal-line" />}
                        onClick={onExpandAll}
                        title="Expand All"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <Button
                        icon={<i className="ri-collapse-diagonal-line" />}
                        onClick={onCollapseAll}
                        title="Collapse All"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div style={styles.spacer} />
                <Button
                    type="primary"
                    icon={<i className="ri-save-line" />}
                    onClick={onSave}
                    disabled={!isDirty}
                    loading={saving}
                    shape="round"
                    size="small"
                >
                    {isDirty ? 'Save' : 'Saved'}
                </Button>
            </div>
        </div>
    );
};

export default TreeToolbar;
