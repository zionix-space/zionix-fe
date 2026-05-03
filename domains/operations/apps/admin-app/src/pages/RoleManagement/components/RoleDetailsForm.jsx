import { useEffect } from 'react';
import { BaseForm, BaseInput, BaseSelect, BaseEmpty, BaseTag, BaseSpace, BaseSwitch } from '@zionix-space/design-system';
import { useTheme } from '@zionix-space/design-system';
import './RoleDetailsForm.scss';

const { TextArea } = BaseInput;
const { Option } = BaseSelect;

const RoleDetailsForm = ({ selectedKey, selectedItem, accessLevels, onAccessChange }) => {
    const { token } = useTheme();
    const [form] = BaseForm.useForm();

    useEffect(() => {
        if (selectedItem) {
            const currentAccess = accessLevels?.[selectedKey] || 'disabled';

            // Update fields when tree selection changes
            form.setFieldsValue({
                accessLevel: currentAccess,
                isActive: selectedItem.is_active ?? true,
                route: selectedItem.route || '',
                component: selectedItem.component || '',
            });
        }
    }, [selectedKey, selectedItem, accessLevels, form]);

    const handleValuesChange = (changedValues) => {
        // If access level changed, update the tree access levels
        if (changedValues.accessLevel && selectedKey && onAccessChange) {
            onAccessChange(selectedKey, changedValues.accessLevel, true);
        }
    };

    if (!selectedItem) {
        return (
            <div className="role-details-form-empty">
                <BaseEmpty description="Select a menu item from the tree to configure role access" image={BaseEmpty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    const currentAccess = accessLevels?.[selectedKey] || 'disabled';

    return (
        <div className="role-details-form-container">
            <BaseForm form={form} layout="vertical" onValuesChange={handleValuesChange} className="role-details-form-content role-editor-scrollbar" size="middle">
                {/* Selected Menu Info */}
                <div className="role-details-form-section" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                    <div className="role-details-form-section-title" style={{ color: token.colorTextSecondary }}>Selected Menu</div>
                    <div
                        className="role-details-form-info-box"
                        style={{
                            background: token.colorBgLayout,
                            border: `1px solid ${token.colorBorderSecondary}`
                        }}
                    >
                        <div className="role-details-form-grid-row-3">
                            <div>
                                <strong>Menu:</strong> {selectedItem.label}
                            </div>
                            <div>
                                <strong>Key:</strong> <BaseTag>{selectedItem.key}</BaseTag>
                            </div>
                            <div>
                                <strong>Current Access:</strong>{' '}
                                <BaseTag color={
                                    currentAccess === 'full' ? 'green' :
                                        currentAccess === 'read' ? 'blue' :
                                            currentAccess === 'write' ? 'orange' : 'default'
                                }>
                                    {currentAccess.toUpperCase()}
                                </BaseTag>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Information Section */}
                <div className="role-details-form-section" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                    <div className="role-details-form-section-title" style={{ color: token.colorTextSecondary }}>Role Information</div>
                    <div className="role-details-form-grid-row-3">
                        <BaseForm.Item
                            label="Role Name"
                            name="roleName"
                            rules={[
                                { required: true, message: 'Please enter role name' },
                                { min: 3, message: 'Role name must be at least 3 characters' }
                            ]}
                        >
                            <BaseInput placeholder="e.g., Admin, Editor, Viewer" />
                        </BaseForm.Item>

                        <BaseForm.Item
                            label="Access Level"
                            name="accessLevel"
                            rules={[{ required: true, message: 'Please select access level' }]}
                            tooltip="This determines what actions the role can perform on this menu item"
                        >
                            <BaseSelect placeholder="Select access level">
                                <Option value="disabled">
                                    <BaseSpace>
                                        <BaseTag color="default">DISABLED</BaseTag>
                                        <span>No access</span>
                                    </BaseSpace>
                                </Option>
                                <Option value="read">
                                    <BaseSpace>
                                        <BaseTag color="blue">READ</BaseTag>
                                        <span>View only</span>
                                    </BaseSpace>
                                </Option>
                                <Option value="write">
                                    <BaseSpace>
                                        <BaseTag color="orange">WRITE</BaseTag>
                                        <span>View & edit</span>
                                    </BaseSpace>
                                </Option>
                                <Option value="full">
                                    <BaseSpace>
                                        <BaseTag color="green">FULL</BaseTag>
                                        <span>Complete control</span>
                                    </BaseSpace>
                                </Option>
                            </BaseSelect>
                        </BaseForm.Item>

                        <BaseForm.Item
                            label="Active Status"
                            name="isActive"
                            valuePropName="checked"
                            tooltip="Inactive roles cannot be assigned to users"
                        >
                            <BaseSwitch
                                checkedChildren="Active"
                                unCheckedChildren="Inactive"
                            />
                        </BaseForm.Item>

                        <div className="role-details-form-grid-full">
                            <BaseForm.Item
                                label="Role Description"
                                name="roleDescription"
                                rules={[{ required: true, message: 'Please enter role description' }]}
                            >
                                <TextArea
                                    placeholder="Describe the purpose and responsibilities of this role"
                                    rows={3}
                                    showCount
                                    maxLength={500}
                                />
                            </BaseForm.Item>
                        </div>
                    </div>
                </div>

                {/* Additional Settings Section */}
                <div className="role-details-form-section" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                    <div className="role-details-form-section-title" style={{ color: token.colorTextSecondary }}>Additional Settings</div>
                    <div className="role-details-form-grid-row-3">
                        <BaseForm.Item
                            label="Route Path"
                            name="route"
                            tooltip="The URL path for this menu item (read-only)"
                        >
                            <BaseInput
                                placeholder="/admin/dashboard"
                                prefix={<i className="ri-route-line" />}
                                disabled
                            />
                        </BaseForm.Item>

                        <BaseForm.Item
                            label="Component"
                            name="component"
                            tooltip="The React component to render for this route (read-only)"
                        >
                            <BaseInput
                                placeholder="DashboardComponent"
                                prefix={<i className="ri-code-box-line" />}
                                disabled
                            />
                        </BaseForm.Item>

                        <BaseForm.Item
                            label="Menu Level"
                            name="level"
                            tooltip="Hierarchy level in the menu tree (read-only)"
                        >
                            <BaseInput
                                placeholder="Level"
                                disabled
                                value={selectedItem.level ?? 0}
                            />
                        </BaseForm.Item>
                    </div>
                </div>

                {/* Access Summary Section */}
                <div className="role-details-form-section">
                    <div className="role-details-form-section-title" style={{ color: token.colorTextSecondary }}>Access Summary</div>
                    <div
                        className="role-details-form-summary-box"
                        style={{
                            background: token.colorBgLayout,
                            border: `1px solid ${token.colorBorderSecondary}`
                        }}
                    >
                        <div className="role-details-form-grid-row-3">
                            <div><strong>Menu Item:</strong> {selectedItem.label}</div>
                            <div><strong>Level:</strong> {selectedItem.level ?? 0}</div>
                            <div><strong>Children:</strong> {selectedItem.children?.length > 0 ? `${selectedItem.children.length} child(s)` : 'None'}</div>
                        </div>
                        {selectedItem.children?.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                                <BaseTag color="warning">
                                    Note: Changing access level will affect {selectedItem.children.length} child menu(s)
                                </BaseTag>
                            </div>
                        )}
                    </div>
                </div>
            </BaseForm>
        </div>
    );
};

export default RoleDetailsForm;
