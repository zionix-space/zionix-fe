import { BaseInput, BaseButton, useTheme } from '@zionix-space/design-system';
import './TreeToolbar.scss';

const TreeToolbar = ({
    searchValue,
    onSearchChange,
    onExpandAll,
    onCollapseAll,
    onSave,
    saveButtonLabel,
    isDirty,
    saving,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onExport,
    onImport,
    onReorder,
    hasReorderChanges,
    reordering
}) => {
    const { token } = useTheme();

    return (
        <div
            className="tree-toolbar-container"
            style={{
                background: token.colorBgElevated,
                borderBottom: `1px solid ${token.colorBorderSecondary}`
            }}
        >
            <div className="tree-toolbar-row">
                <BaseInput.Search
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    className="tree-toolbar-search"
                    size="small"
                />
                <div className="tree-toolbar-spacer" />
                <div
                    className="tree-toolbar-capsule"
                    style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
                    <BaseButton
                        icon={<i className="ri-arrow-go-back-line" />}
                        onClick={onUndo}
                        disabled={!canUndo || saving}
                        title="Undo"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                    <BaseButton
                        icon={<i className="ri-arrow-go-forward-line" />}
                        onClick={onRedo}
                        disabled={!canRedo || saving}
                        title="Redo"
                        shape="circle"
                        size="small"
                        type="text"
                    />
                </div>
                <div
                    className="tree-toolbar-capsule"
                    style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
                    <BaseButton
                        icon={<i className="ri-download-line" />}
                        onClick={onExport}
                        title="Export"
                        shape="circle"
                        size="small"
                        type="text"
                        disabled={saving}
                    />
                    <BaseButton
                        icon={<i className="ri-upload-line" />}
                        onClick={onImport}
                        title="Import"
                        shape="circle"
                        size="small"
                        type="text"
                        disabled={saving}
                    />
                </div>
                <div
                    className="tree-toolbar-capsule"
                    style={{
                        background: token.colorBgContainer,
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
                    <BaseButton
                        icon={<i className="ri-expand-diagonal-line" />}
                        onClick={onExpandAll}
                        title="Expand All"
                        shape="circle"
                        size="small"
                        type="text"
                        disabled={saving}
                    />
                    <BaseButton
                        icon={<i className="ri-collapse-diagonal-line" />}
                        onClick={onCollapseAll}
                        title="Collapse All"
                        shape="circle"
                        size="small"
                        type="text"
                        disabled={saving}
                    />
                </div>
                <div className="tree-toolbar-spacer" />
                {hasReorderChanges && (
                    <BaseButton
                        type="default"
                        icon={<i className="ri-sort-asc" />}
                        onClick={onReorder}
                        loading={reordering}
                        disabled={reordering || saving}
                        shape="round"
                        size="middle"
                        style={{ marginRight: '8px' }}
                    >
                        Reorder
                    </BaseButton>
                )}
                <BaseButton
                    type="primary"
                    icon={<i className="ri-save-line" />}
                    onClick={onSave}
                    disabled={!isDirty || saving || reordering}
                    loading={saving}
                    shape="round"
                    size="middle"
                >
                    {saveButtonLabel || (isDirty ? 'Save' : 'Saved')}
                </BaseButton>
            </div>
        </div>
    );
};

export default TreeToolbar;
