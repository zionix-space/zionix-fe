import { BaseInput, BaseButton, useTheme } from '@zionix-space/design-system';
import { useStyles } from './TreeToolbar.style';

const TreeToolbar = ({ searchValue, onSearchChange, onExpandAll, onCollapseAll, onSave, isDirty, saving, onUndo, onRedo, canUndo, canRedo, onExport, onImport }) => {
    const { token } = useTheme();

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    return (
        <div style={styles.toolbarContainer}>
            <div style={styles.singleRow}>
                <BaseInput.Search
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    style={styles.searchInput}
                    size="small"
                />
                <div style={styles.spacer} />
                <div style={styles.capsuleContainer}>
                    <BaseButton
                        icon={<i className="ri-arrow-go-back-line" />}
                        onClick={onUndo}
                        disabled={!canUndo}
                        title="Undo"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <BaseButton
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
                    <BaseButton
                        icon={<i className="ri-download-line" />}
                        onClick={onExport}
                        title="Export"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <BaseButton
                        icon={<i className="ri-upload-line" />}
                        onClick={onImport}
                        title="Import"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div style={styles.capsuleContainer}>
                    <BaseButton
                        icon={<i className="ri-expand-diagonal-line" />}
                        onClick={onExpandAll}
                        title="Expand All"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <BaseButton
                        icon={<i className="ri-collapse-diagonal-line" />}
                        onClick={onCollapseAll}
                        title="Collapse All"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div style={styles.spacer} />
                <BaseButton
                    type="primary"
                    icon={<i className="ri-save-line" />}
                    onClick={onSave}
                    disabled={!isDirty}
                    loading={saving}
                    shape="round"
                    size="small"
                >
                    {isDirty ? 'Save' : 'Saved'}
                </BaseButton>
            </div>
        </div>
    );
};

export default TreeToolbar;
