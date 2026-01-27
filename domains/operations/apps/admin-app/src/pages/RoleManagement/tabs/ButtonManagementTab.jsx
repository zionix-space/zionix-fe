import { useState } from 'react';
import { BaseCard, BaseTypography, BaseSpace, BaseButton, BaseTable, BaseModal, BaseForm, BaseInput, BaseSelect, BaseTag, baseMessage } from '@zionix-space/design-system';

const { Title, Paragraph } = BaseTypography;
const { Option } = BaseSelect;

const ButtonManagementTab = () => {
    const [buttons, setButtons] = useState([
        { id: 1, name: 'Save', type: 'primary', action: 'save', roles: ['admin', 'editor'] },
        { id: 2, name: 'Delete', type: 'danger', action: 'delete', roles: ['admin'] },
        { id: 3, name: 'Cancel', type: 'default', action: 'cancel', roles: ['admin', 'editor', 'viewer'] },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingButton, setEditingButton] = useState(null);
    const [form] = BaseForm.useForm();

    const handleAdd = () => {
        setEditingButton(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingButton(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        BaseModal.confirm({
            title: 'Delete Button',
            content: 'Are you sure you want to delete this button?',
            onOk: () => {
                setButtons(buttons.filter(btn => btn.id !== id));
                baseMessage.success('Button deleted successfully');
            },
        });
    };

    const handleSubmit = (values) => {
        if (editingButton) {
            setButtons(buttons.map(btn =>
                btn.id === editingButton.id ? { ...btn, ...values } : btn
            ));
            baseMessage.success('Button updated successfully');
        } else {
            const newButton = { ...values, id: Date.now() };
            setButtons([...buttons, newButton]);
            baseMessage.success('Button created successfully');
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Button Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <BaseTag color={type === 'primary' ? 'blue' : type === 'danger' ? 'red' : 'default'}>{type}</BaseTag>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <>
                    {roles.map(role => (
                        <BaseTag key={role} color="green">{role}</BaseTag>
                    ))}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <BaseSpace>
                    <BaseButton
                        type="text"
                        icon={<i className="ri-edit-line" />}
                        onClick={() => handleEdit(record)}
                    />
                    <BaseButton
                        type="text"
                        danger
                        icon={<i className="ri-delete-bin-line" />}
                        onClick={() => handleDelete(record.id)}
                    />
                </BaseSpace>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', height: 'calc(100vh - 46px)', overflow: 'auto' }}>
            <BaseSpace direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>Button Management</Title>
                        <Paragraph style={{ margin: '4px 0 0 0' }}>
                            Configure and manage application buttons and their role-based access.
                        </Paragraph>
                    </div>
                    <BaseButton
                        type="primary"
                        icon={<i className="ri-add-line" />}
                        onClick={handleAdd}
                        shape='round'
                    >
                        Add Button
                    </BaseButton>
                </div>

                <BaseCard>
                    <BaseTable
                        columns={columns}
                        dataSource={buttons}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </BaseCard>
            </BaseSpace>

            <BaseModal
                title={editingButton ? 'Edit Button' : 'Add Button'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText={editingButton ? 'Update' : 'Create'}
            >
                <BaseForm
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <BaseForm.Item
                        name="name"
                        label="Button Name"
                        rules={[{ required: true, message: 'Please enter button name' }]}
                    >
                        <BaseInput placeholder="Enter button name" />
                    </BaseForm.Item>

                    <BaseForm.Item
                        name="type"
                        label="Button Type"
                        rules={[{ required: true, message: 'Please select button type' }]}
                    >
                        <BaseSelect placeholder="Select button type">
                            <Option value="primary">Primary</Option>
                            <Option value="default">Default</Option>
                            <Option value="danger">Danger</Option>
                            <Option value="link">Link</Option>
                        </BaseSelect>
                    </BaseForm.Item>

                    <BaseForm.Item
                        name="action"
                        label="Action"
                        rules={[{ required: true, message: 'Please enter action' }]}
                    >
                        <BaseInput placeholder="Enter action (e.g., save, delete)" />
                    </BaseForm.Item>

                    <BaseForm.Item
                        name="roles"
                        label="Allowed Roles"
                        rules={[{ required: true, message: 'Please select at least one role' }]}
                    >
                        <BaseSelect mode="multiple" placeholder="Select roles">
                            <Option value="admin">Admin</Option>
                            <Option value="editor">Editor</Option>
                            <Option value="viewer">Viewer</Option>
                        </BaseSelect>
                    </BaseForm.Item>
                </BaseForm>
            </BaseModal>
        </div>
    );
};

export default ButtonManagementTab;
