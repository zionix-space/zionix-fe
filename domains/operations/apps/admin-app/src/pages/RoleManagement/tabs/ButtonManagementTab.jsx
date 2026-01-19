import { useState } from 'react';
import { Card, Typography, Space, Button, Table, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ButtonManagementTab = () => {
    const [buttons, setButtons] = useState([
        { id: 1, name: 'Save', type: 'primary', action: 'save', roles: ['admin', 'editor'] },
        { id: 2, name: 'Delete', type: 'danger', action: 'delete', roles: ['admin'] },
        { id: 3, name: 'Cancel', type: 'default', action: 'cancel', roles: ['admin', 'editor', 'viewer'] },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingButton, setEditingButton] = useState(null);
    const [form] = Form.useForm();

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
        Modal.confirm({
            title: 'Delete Button',
            content: 'Are you sure you want to delete this button?',
            onOk: () => {
                setButtons(buttons.filter(btn => btn.id !== id));
                message.success('Button deleted successfully');
            },
        });
    };

    const handleSubmit = (values) => {
        if (editingButton) {
            setButtons(buttons.map(btn =>
                btn.id === editingButton.id ? { ...btn, ...values } : btn
            ));
            message.success('Button updated successfully');
        } else {
            const newButton = { ...values, id: Date.now() };
            setButtons([...buttons, newButton]);
            message.success('Button created successfully');
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
            render: (type) => <Tag color={type === 'primary' ? 'blue' : type === 'danger' ? 'red' : 'default'}>{type}</Tag>,
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
                        <Tag key={role} color="green">{role}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', height: 'calc(100vh - 46px)', overflow: 'auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>Button Management</Title>
                        <Paragraph style={{ margin: '4px 0 0 0' }}>
                            Configure and manage application buttons and their role-based access.
                        </Paragraph>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        shape='round'
                    >
                        Add Button
                    </Button>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={buttons}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </Space>

            <Modal
                title={editingButton ? 'Edit Button' : 'Add Button'}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText={editingButton ? 'Update' : 'Create'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Button Name"
                        rules={[{ required: true, message: 'Please enter button name' }]}
                    >
                        <Input placeholder="Enter button name" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Button Type"
                        rules={[{ required: true, message: 'Please select button type' }]}
                    >
                        <Select placeholder="Select button type">
                            <Option value="primary">Primary</Option>
                            <Option value="default">Default</Option>
                            <Option value="danger">Danger</Option>
                            <Option value="link">Link</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="action"
                        label="Action"
                        rules={[{ required: true, message: 'Please enter action' }]}
                    >
                        <Input placeholder="Enter action (e.g., save, delete)" />
                    </Form.Item>

                    <Form.Item
                        name="roles"
                        label="Allowed Roles"
                        rules={[{ required: true, message: 'Please select at least one role' }]}
                    >
                        <Select mode="multiple" placeholder="Select roles">
                            <Option value="admin">Admin</Option>
                            <Option value="editor">Editor</Option>
                            <Option value="viewer">Viewer</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ButtonManagementTab;
