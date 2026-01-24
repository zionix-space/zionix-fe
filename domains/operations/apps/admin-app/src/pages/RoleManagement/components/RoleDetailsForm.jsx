import { useEffect, useState } from 'react';
import { Form, Input, Select, Empty, Button, Card, Tag, Space, Divider, Switch, message, theme } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const { useToken } = theme;

const RoleDetailsForm = ({ selectedKey, selectedItem, permissions, onPermissionChange }) => {
    const { token } = useToken();
    const [form] = Form.useForm();
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

            // Only update fields that should change based on tree selection
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

        // If access level changed, update the tree permissions
        if (changedValues.accessLevel && selectedKey && onPermissionChange) {
            onPermissionChange(selectedKey, changedValues.accessLevel, true);
        }
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Saving role details:', values);
            message.success('Role details saved successfully');
            setHasChanges(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCreateNew = () => {
        form.resetFields();
        setHasChanges(false);
        message.info('Ready to create new role');
    };

    if (!selectedItem) {
        return (
            <Card style={{ height: '100%' }}>
                <Empty
                    description="Select a menu item from the tree to configure role access"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    const currentPermission = permissions?.[selectedKey] || 'disabled';
    const infoBg = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#f5f5f5';
    const summaryBg = isDarkMode ? 'rgba(255, 255, 255, 0.04)' : '#fafafa';

    return (
        <Card
            title="Role Access Configuration"
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<i className="ri-save-line" />}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        size="small"
                    >
                        Save
                    </Button>
                    <Button
                        icon={<i className="ri-add-line" />}
                        onClick={handleCreateNew}
                        size="small"
                    >
                        New Role
                    </Button>
                </Space>
            }
            style={{ height: '100%', overflow: 'auto' }}
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                size="middle"
            >
                {/* Selected Menu Info */}
                <div style={{ marginBottom: 24, padding: 16, background: infoBg, borderRadius: 8 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                            <strong>Selected Menu:</strong> {selectedItem.label}
                        </div>
                        <div>
                            <strong>Key:</strong> <Tag>{selectedItem.key}</Tag>
                        </div>
                        <div>
                            <strong>Current Access:</strong>{' '}
                            <Tag color={
                                currentPermission === 'full' ? 'green' :
                                    currentPermission === 'read' ? 'blue' :
                                        currentPermission === 'write' ? 'orange' : 'default'
                            }>
                                {currentPermission.toUpperCase()}
                            </Tag>
                        </div>
                    </Space>
                </div>

                <Divider orientation="left">Role Information</Divider>

                <Form.Item
                    label="Role Name"
                    name="roleName"
                    rules={[
                        { required: true, message: 'Please enter role name' },
                        { min: 3, message: 'Role name must be at least 3 characters' }
                    ]}
                >
                    <Input
                        placeholder="e.g., Admin, Editor, Viewer"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Role Description"
                    name="roleDescription"
                    rules={[{ required: true, message: 'Please enter role description' }]}
                >
                    <TextArea
                        placeholder="Describe the purpose and responsibilities of this role"
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    label="Access Level"
                    name="accessLevel"
                    rules={[{ required: true, message: 'Please select access level' }]}
                    tooltip="This determines what actions the role can perform on this menu item"
                >
                    <Select
                        placeholder="Select access level"
                        size="large"
                    >
                        <Option value="disabled">
                            <Space>
                                <Tag color="default">DISABLED</Tag>
                                <span>No access to this menu</span>
                            </Space>
                        </Option>
                        <Option value="read">
                            <Space>
                                <Tag color="blue">READ</Tag>
                                <span>View only access</span>
                            </Space>
                        </Option>
                        <Option value="write">
                            <Space>
                                <Tag color="orange">WRITE</Tag>
                                <span>Can view and edit</span>
                            </Space>
                        </Option>
                        <Option value="full">
                            <Space>
                                <Tag color="green">FULL</Tag>
                                <span>Complete control</span>
                            </Space>
                        </Option>
                    </Select>
                </Form.Item>

                <Divider orientation="left">Additional Settings</Divider>

                <Form.Item
                    label="Active Status"
                    name="isActive"
                    valuePropName="checked"
                    tooltip="Inactive roles cannot be assigned to users"
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>

                <Form.Item
                    label="Route Path"
                    name="route"
                    tooltip="The URL path for this menu item"
                >
                    <Input
                        placeholder="/admin/dashboard"
                        prefix={<i className="ri-route-line" />}
                    />
                </Form.Item>

                <Form.Item
                    label="Component"
                    name="component"
                    tooltip="The React component to render for this route"
                >
                    <Input
                        placeholder="DashboardComponent"
                        prefix={<i className="ri-code-box-line" />}
                    />
                </Form.Item>

                {/* Access Permissions Summary */}
                <Divider orientation="left">Permission Summary</Divider>

                <div style={{
                    padding: 16,
                    background: summaryBg,
                    borderRadius: 8,
                    border: `1px solid ${token.colorBorder}`
                }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div><strong>Menu Item:</strong> {selectedItem.label}</div>
                        <div><strong>Level:</strong> {selectedItem.level ?? 0}</div>
                        <div><strong>Has Children:</strong> {selectedItem.children?.length > 0 ? 'Yes' : 'No'}</div>
                        {selectedItem.children?.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <Tag color="warning">
                                    Note: Changing access level will affect {selectedItem.children.length} child menu(s)
                                </Tag>
                            </div>
                        )}
                    </Space>
                </div>
            </Form>
        </Card>
    );
};

export default RoleDetailsForm;
