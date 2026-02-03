import { useEffect, useState } from 'react';
import { BaseForm, BaseInput, BaseSelect, Empty, BaseButton, BaseCard, BaseTag, BaseSpace, BaseDivider, BaseSwitch, baseMessage, theme } from '@zionix-space/design-system';

const { TextArea } = BaseInput;
const { Option } = BaseSelect;
const { useToken } = theme;

const RoleDetailsForm = ({ selectedKey, selectedItem, permissions, onPermissionChange }) => {
    const { token } = useToken();
    const [form] = BaseForm.useForm();
    const [hasChanges, setHasChanges] = useState(false);

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    useEffect(() => {
        if (selectedItem) {
            const currentPermission = permissions?.[selectedKey] || 'disabled';

            // Only update fields that should change based on BaseTree selection
            // Role Name and Description remain unchanged (user enters them manually)
            form.setFieldsValue({
                accessLevel: currentPermission,
                isActive: selectedItem.is_active ?? true,
                route: selectedItem.route || '',
                component: selectedItem.component || '',
            });
            setHasChanges(false);
        }
    }, [selectedKey, selectedItem, permissions, form]);

    const handleValuesChange = (changedValues) => {
        setHasChanges(true);

        // If access level changed, update the BaseTree permissions
        if (changedValues.accessLevel && selectedKey && onPermissionChange) {
            onPermissionChange(selectedKey, changedValues.accessLevel, true);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Saving role details:', values);
            baseMessage.success('Role details saved successfully');
            setHasChanges(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCreateNew = () => {
        form.resetFields();
        setHasChanges(false);
        baseMessage.info('Ready to create new role');
    };

    if (!selectedItem) {
        return (
            <BaseCard style={{ height: '100%' }}>
                <Empty
                    description="BaseSelect a BaseMenu item from the BaseTree to configure role access"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </BaseCard>
        );
    }

    const currentPermission = permissions?.[selectedKey] || 'disabled';
    const infoBg = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#f5f5f5';
    const summaryBg = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#fafafa';

    return (
        <BaseCard
            title="Role Access Configuration"
            extra={
                <BaseSpace>
                    <BaseButton
                        type="primary"
                        icon={<i className="ri-save-line" />}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        size="small"
                    >
                        Save
                    </BaseButton>
                    <BaseButton
                        icon={<i className="ri-add-line" />}
                        onClick={handleCreateNew}
                        size="small"
                    >
                        New Role
                    </BaseButton>
                </BaseSpace>
            }
            style={{ height: '100%', overflow: 'auto' }}
        >
            <BaseForm
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                size="middle"
            >
                {/* Selected BaseMenu Info */}
                <div style={{ marginBottom: 24, padding: 16, background: infoBg, borderRadius: 8 }}>
                    <BaseSpace orientation="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                            <strong>Selected BaseMenu:</strong> {selectedItem.label}
                        </div>
                        <div>
                            <strong>Key:</strong> <BaseTag>{selectedItem.key}</BaseTag>
                        </div>
                        <div>
                            <strong>Current Access:</strong>{' '}
                            <BaseTag color={
                                currentPermission === 'full' ? 'green' :
                                    currentPermission === 'read' ? 'blue' :
                                        currentPermission === 'write' ? 'orange' : 'default'
                            }>
                                {currentPermission.toUpperCase()}
                            </BaseTag>
                        </div>
                    </BaseSpace>
                </div>

                <BaseDivider orientation="left">Role Information</BaseDivider>

                <BaseForm.Item
                    label="Role Name"
                    name="roleName"
                    rules={[
                        { required: true, baseMessage: 'Please enter role name' },
                        { min: 3, baseMessage: 'Role name must be at least 3 characters' }
                    ]}
                >
                    <BaseInput
                        placeholder="e.g., Admin, Editor, Viewer"
                        size="large"
                    />
                </BaseForm.Item>

                <BaseForm.Item
                    label="Role Description"
                    name="roleDescription"
                    rules={[{ required: true, baseMessage: 'Please enter role description' }]}
                >
                    <TextArea
                        placeholder="Describe the purpose and responsibilities of this role"
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </BaseForm.Item>

                <BaseForm.Item
                    label="Access Level"
                    name="accessLevel"
                    rules={[{ required: true, baseMessage: 'Please BaseSelect access level' }]}
                    BaseTooltip="This determines what actions the role can perform on this BaseMenu item"
                >
                    <BaseSelect
                        placeholder="BaseSelect access level"
                        size="large"
                    >
                        <Option value="disabled">
                            <BaseSpace>
                                <BaseTag color="default">DISABLED</BaseTag>
                                <span>No access to this BaseMenu</span>
                            </BaseSpace>
                        </Option>
                        <Option value="read">
                            <BaseSpace>
                                <BaseTag color="blue">READ</BaseTag>
                                <span>View only access</span>
                            </BaseSpace>
                        </Option>
                        <Option value="write">
                            <BaseSpace>
                                <BaseTag color="orange">WRITE</BaseTag>
                                <span>Can view and edit</span>
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

                <BaseDivider orientation="left">Additional Settings</BaseDivider>

                <BaseForm.Item
                    label="Active Status"
                    name="isActive"
                    valuePropName="checked"
                    BaseTooltip="Inactive roles cannot be assigned to users"
                >
                    <BaseSwitch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </BaseForm.Item>

                <BaseForm.Item
                    label="Route Path"
                    name="route"
                    BaseTooltip="The URL path for this BaseMenu item"
                >
                    <BaseInput
                        placeholder="/admin/dashboard"
                        prefix={<i className="ri-route-line" />}
                    />
                </BaseForm.Item>

                <BaseForm.Item
                    label="Component"
                    name="component"
                    BaseTooltip="The React component to render for this route"
                >
                    <BaseInput
                        placeholder="DashboardComponent"
                        prefix={<i className="ri-code-box-line" />}
                    />
                </BaseForm.Item>

                {/* Access Permissions Summary */}
                <BaseDivider orientation="left">Permission Summary</BaseDivider>

                <div style={{
                    padding: 16,
                    background: summaryBg,
                    borderRadius: 8,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    <BaseSpace orientation="vertical" size="small" style={{ width: '100%' }}>
                        <div><strong>BaseMenu Item:</strong> {selectedItem.label}</div>
                        <div><strong>Level:</strong> {selectedItem.level ?? 0}</div>
                        <div><strong>Has Children:</strong> {selectedItem.children?.length > 0 ? 'Yes' : 'No'}</div>
                        {selectedItem.children?.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <BaseTag color="warning">
                                    Note: Changing access level will affect {selectedItem.children.length} child BaseMenu(s)
                                </BaseTag>
                            </div>
                        )}
                    </BaseSpace>
                </div>
            </BaseForm>
        </BaseCard>
    );
};

export default RoleDetailsForm;
