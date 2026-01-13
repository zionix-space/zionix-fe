import { useEffect, useState, useRef } from 'react';
import { Form, Input, InputNumber, Switch, Empty, Button, Popconfirm, Radio, Select, theme } from 'antd';
import { useStyles } from './MenuForm.style';
import IconPicker from './IconPicker';

const { TextArea } = Input;
const { useToken } = theme;

const MenuForm = ({ selectedKey, selectedItem, allMenuKeys, onChange, onDelete, onAddChild }) => {
    const { token } = useToken();
    const [form] = Form.useForm();
    const [badgeType, setBadgeType] = useState('none');
    const previousSelectedKeyRef = useRef(null);

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    useEffect(() => {
        // Only update form when a different item is selected (based on selectedKey from parent)
        if (selectedKey && selectedKey !== previousSelectedKeyRef.current) {
            // New item selected
            previousSelectedKeyRef.current = selectedKey;

            if (selectedItem) {
                let currentBadgeType = 'none';
                if (selectedItem.badge) {
                    if (typeof selectedItem.badge === 'string') {
                        currentBadgeType = 'string';
                    } else if (typeof selectedItem.badge === 'object') {
                        currentBadgeType = 'object';
                    }
                }
                setBadgeType(currentBadgeType);

                form.setFieldsValue({
                    key: selectedItem.key || '',
                    label: selectedItem.label || '',
                    description: selectedItem.description || '',
                    sectionTitle: selectedItem.sectionTitle || '',
                    route: selectedItem.route || '',
                    component: selectedItem.component || '',
                    order_index: selectedItem.order_index ?? 0,
                    level: selectedItem.level ?? 0,
                    icon: selectedItem.icon || '',
                    is_visible: selectedItem.is_visible ?? true,
                    is_active: selectedItem.is_active ?? true,
                    badgeString: typeof selectedItem.badge === 'string' ? selectedItem.badge : '',
                    badgeCount: typeof selectedItem.badge === 'object' && selectedItem.badge !== null ? selectedItem.badge.count : '',
                    badgeColor: typeof selectedItem.badge === 'object' && selectedItem.badge !== null ? selectedItem.badge.color : 'blue',
                    application_id: selectedItem.application_id || '',
                    application_name: selectedItem.application_name || '',
                    application_version: selectedItem.application_version || '',
                    application_status: selectedItem.application_status || '',
                    object_id: selectedItem.object_id || '',
                    menu_id: selectedItem.menu_id || '',
                    menu_metadata: selectedItem.menu_metadata ? JSON.stringify(selectedItem.menu_metadata, null, 2) : '{}',
                });
            }
        } else if (!selectedKey) {
            // No item selected
            previousSelectedKeyRef.current = null;
            form.resetFields();
            setBadgeType('none');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    const handleFieldChange = (changedFields) => {
        const fieldName = Object.keys(changedFields)[0];
        const fieldValue = changedFields[fieldName];

        // Special handling for key field - we need to update the selectedKey in parent
        if (fieldName === 'key') {
            if (onChange && selectedKey) {
                // When key changes, we need to tell parent to update the selection
                onChange(selectedKey, { [fieldName]: fieldValue });
            }
            return;
        }

        if (fieldName === 'badgeString' || fieldName === 'badgeCount' || fieldName === 'badgeColor') {
            let badgeValue = null;
            if (badgeType === 'string') {
                badgeValue = form.getFieldValue('badgeString') || null;
            } else if (badgeType === 'object') {
                const count = form.getFieldValue('badgeCount');
                const color = form.getFieldValue('badgeColor');
                if (count) {
                    badgeValue = { count, color: color || 'blue' };
                }
            }
            if (onChange && selectedKey) {
                onChange(selectedKey, { badge: badgeValue });
            }
            return;
        }

        if (fieldName === 'menu_metadata') {
            try {
                const parsed = JSON.parse(fieldValue);
                if (onChange && selectedKey) {
                    onChange(selectedKey, { menu_metadata: parsed });
                }
            } catch (e) {
                // Invalid JSON
            }
            return;
        }

        if (onChange && selectedKey) {
            onChange(selectedKey, { [fieldName]: fieldValue });
        }
    };

    const handleBadgeTypeChange = (e) => {
        const newType = e.target.value;
        setBadgeType(newType);

        let badgeValue = null;
        if (newType === 'string') {
            badgeValue = form.getFieldValue('badgeString') || '';
        } else if (newType === 'object') {
            const count = form.getFieldValue('badgeCount');
            const color = form.getFieldValue('badgeColor') || 'blue';
            if (count) {
                badgeValue = { count, color };
            }
        }

        if (onChange && selectedKey) {
            onChange(selectedKey, { badge: badgeValue });
        }
    };

    if (!selectedItem) {
        return (
            <div style={styles.emptyState}>
                <Empty description="Select a menu item to edit" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <div style={styles.formContainer}>
            {/* Action Header */}
            <div style={styles.formHeader}>
                <Button
                    type="primary"
                    icon={<i className="ri-add-line" />}
                    onClick={onAddChild}
                    shape="round"
                    size="small"
                >
                    Add Child
                </Button>
                <Popconfirm
                    title="Delete menu item"
                    description="Are you sure you want to delete this item and all its children?"
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<i className="ri-delete-bin-line" />} shape="round" size="small">
                        Delete
                    </Button>
                </Popconfirm>
            </div>

            <Form form={form} layout="vertical" onValuesChange={handleFieldChange} style={styles.form} size="middle" className="menu-editor-scrollbar">
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Basic Information</div>
                    <Form.Item
                        label="Key"
                        name="key"
                        rules={[
                            { required: true, message: 'Key is required' },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    const duplicates = allMenuKeys.filter((k) => k === value);
                                    if (duplicates.length > 1) {
                                        return Promise.reject(new Error('Key must be unique'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Enter unique key" />
                    </Form.Item>
                    <Form.Item label="Label" name="label" rules={[{ required: true, message: 'Label is required' }]}>
                        <Input placeholder="Enter label" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <TextArea placeholder="Enter description" rows={3} />
                    </Form.Item>
                    <Form.Item label="Section Title" name="sectionTitle">
                        <Input placeholder="Enter section title (optional)" />
                    </Form.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Routing & Navigation</div>
                    <Form.Item label="Route" name="route">
                        <Input placeholder="Enter route path" />
                    </Form.Item>
                    <Form.Item label="Component" name="component">
                        <Input placeholder="Enter component name" />
                    </Form.Item>
                    <Form.Item label="Order Index" name="order_index">
                        <InputNumber placeholder="Enter order" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item label="Level" name="level">
                        <InputNumber placeholder="Level" style={{ width: '100%' }} disabled min={0} />
                    </Form.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Display Settings</div>
                    <Form.Item label="Icon" name="icon">
                        <IconPicker />
                    </Form.Item>
                    <Form.Item label="Visible" name="is_visible" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Active" name="is_active" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Badge Configuration</div>
                    <Form.Item label="Badge Type">
                        <Radio.Group value={badgeType} onChange={handleBadgeTypeChange}>
                            <Radio value="none">None</Radio>
                            <Radio value="string">String</Radio>
                            <Radio value="object">Object</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {badgeType === 'string' && (
                        <Form.Item label="Badge Text" name="badgeString">
                            <Input placeholder="Enter badge text" />
                        </Form.Item>
                    )}

                    {badgeType === 'object' && (
                        <>
                            <Form.Item label="Badge Count" name="badgeCount">
                                <Input placeholder="Enter count" />
                            </Form.Item>
                            <Form.Item label="Badge Color" name="badgeColor">
                                <Select placeholder="Select color">
                                    <Select.Option value="blue">Blue</Select.Option>
                                    <Select.Option value="green">Green</Select.Option>
                                    <Select.Option value="orange">Orange</Select.Option>
                                    <Select.Option value="purple">Purple</Select.Option>
                                    <Select.Option value="red">Red</Select.Option>
                                    <Select.Option value="cyan">Cyan</Select.Option>
                                    <Select.Option value="gold">Gold</Select.Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Application Settings</div>
                    <Form.Item label="Application ID" name="application_id">
                        <Input placeholder="Enter application ID" />
                    </Form.Item>
                    <Form.Item label="Application Name" name="application_name">
                        <Input placeholder="Enter application name" />
                    </Form.Item>
                    <Form.Item label="Application Version" name="application_version">
                        <Input placeholder="Enter version" />
                    </Form.Item>
                    <Form.Item label="Application Status" name="application_status">
                        <Select placeholder="Select status">
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                            <Select.Option value="development">Development</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Object ID" name="object_id">
                        <Input placeholder="Enter object ID" />
                    </Form.Item>
                    <Form.Item label="Menu ID" name="menu_id">
                        <Input placeholder="Auto-generated" disabled />
                    </Form.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Metadata</div>
                    <Form.Item label="Menu Metadata (JSON)" name="menu_metadata">
                        <TextArea placeholder='{"key": "value"}' rows={4} />
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default MenuForm;
