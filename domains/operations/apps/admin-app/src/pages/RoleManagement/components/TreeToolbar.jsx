import { BaseInput, BaseButton, theme } from '@zionix-space/design-system';
import './TreeToolbar.scss';

const { Search } = BaseInput;
const { useToken } = theme;

const TreeToolbar = ({ searchValue, onSearchChange, onExpandAll, onCollapseAll, onSave, isDirty, saving, onUndo, onRedo, canUndo, canRedo, onExport, onImport, onBulkAccessChange }) => {
    const { token } = useToken();

    return (
        <div className="tree-toolbar-container">
            <div className="tree-toolbar-row">
                <Search
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    className="tree-toolbar-search"
                    size="small"
                />
                <div className="tree-toolbar-spacer" />
                <div className="tree-toolbar-capsule">
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
                <div className="tree-toolbar-capsule">
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
                <div className="tree-toolbar-capsule">
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
                <div className="tree-toolbar-spacer" />
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
