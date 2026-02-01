import { useEffect, useState, useRef } from 'react';
import { BaseForm, BaseInput, BaseInputNumber, BaseSwitch, BaseEmpty, BaseButton, BasePopconfirm, BaseRadio, BaseSelect, theme } from '@zionix-space/design-system';
import { useStyles } from './RoleForm.style';
import { useCreateMenuMutation } from '../hooks/useRoleQuery';
import { getParentPath } from '../utils/roleTransformers';

const { TextArea } = BaseInput;
const { useToken } = theme;

const RoleForm = ({ selectedKey, selectedItem, allMenuKeys, menuData, onChange, onDelete, onAddChild }) => {
    const { token } = useToken();
    const [form] = BaseForm.useForm();
    const [badgeType, setBadgeType] = useState('none');
    const [isAddingChild, setIsAddingChild] = useState(false);
    const [newChildData, setNewChildData] = useState(null);
    const previousSelectedKeyRef = useRef(null);
    const createMenuMutation = useCreateMenuMutation();

    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    useEffect(() => {
        // Only update BaseForm when a different item is selected (based on selectedKey from parent)
        if (selectedKey && selectedKey !== previousSelectedKeyRef.current) {
            previousSelectedKeyRef.current = selectedKey;

            if (selectedItem) {
                // Check if this is a newly created item (starts with 'new-BaseMenu-')
                const isNewItem = selectedItem.key && selectedItem.key.startsWith('new-BaseMenu-');

                // If it's a new item, set add mode to true
                if (isNewItem) {
                    setIsAddingChild(true);
                } else {
                    setIsAddingChild(false);
                }

                setNewChildData(null);

                let currentBadgeType = 'none';
                if (selectedItem.BaseBadge) {
                    if (typeof selectedItem.BaseBadge === 'string') {
                        currentBadgeType = 'string';
                    } else if (typeof selectedItem.BaseBadge === 'object') {
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
                    badgeString: typeof selectedItem.BaseBadge === 'string' ? selectedItem.BaseBadge : '',
                    badgeCount: typeof selectedItem.BaseBadge === 'object' && selectedItem.BaseBadge !== null ? selectedItem.BaseBadge.count : '',
                    badgeColor: typeof selectedItem.BaseBadge === 'object' && selectedItem.BaseBadge !== null ? selectedItem.BaseBadge.color : 'blue',
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
            setIsAddingChild(false);
            setNewChildData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKey]);

    const handleFieldChange = (changedFields) => {
        // If we're in add mode (creating a new child), don't update the BaseTree in real-time
        // Changes will be saved when the user clicks "Save" and API call succeeds
        if (isAddingChild) {
            return;
        }

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
                onChange(selectedKey, { BaseBadge: badgeValue });
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
            onChange(selectedKey, { BaseBadge: badgeValue });
        }
    };

    const handleAddChildClick = () => {
        // Call the original onAddChild to create the child in the BaseTree
        onAddChild();
        // BaseSwitch to "add mode" - BaseButton will show "Save"
        setIsAddingChild(true);
    };

    const handleSaveNewChild = async () => {
        try {
            // Validate BaseForm
            await form.validateFields();

            // Get all BaseForm values
            const formValues = form.getFieldsValue();

            // Get dynamic nav_doc_id from menuData (root level _id)
            const navDocId = menuData?._id;
            if (!navDocId) {
                console.error('Navigation document ID not found');
                return;
            }

            // Get dynamic parent path from root to the NEW child's parent
            // Since selectedKey is the NEW child, getParentPath returns the path to its parent
            const parentPath = getParentPath(menuData, selectedKey);

            if (!parentPath || parentPath.length === 0) {
                console.error('Parent path not found for selected item');
                return;
            }

            // Prepare BaseBadge value
            let badgeValue = null;
            if (badgeType === 'string' && formValues.badgeString) {
                badgeValue = formValues.badgeString;
            } else if (badgeType === 'object' && formValues.badgeCount) {
                badgeValue = {
                    count: formValues.badgeCount,
                    color: formValues.badgeColor || 'blue'
                };
            }

            // Parse menu_metadata
            let menuMetadata = {};
            try {
                menuMetadata = formValues.menu_metadata ? JSON.parse(formValues.menu_metadata) : {};
            } catch (e) {
                menuMetadata = {};
            }

            // Build the API payload according to the schema
            const menuPayload = {
                application_id: formValues.application_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: formValues.label || "string",
                label: formValues.label || "string",
                route: formValues.route || "string",
                component: formValues.component || "string",
                icon: formValues.icon || "string",
                order_index: formValues.order_index ?? 0,
                level: formValues.level ?? 1,
                is_visible: formValues.is_visible ?? true,
                parent_menu_id: selectedItem?.menu_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                menu_metadata: menuMetadata,
                is_active: formValues.is_active ?? true,
                access: ["read"],
                key: formValues.key || "string",
                BaseBadge: badgeValue || "string",
                section_title: formValues.sectionTitle || "string",
                object_id: formValues.object_id || "string",
                menus_description: formValues.description || "string",
                children: []
            };

            // Call the create BaseMenu API with dynamic parameters
            // parentPath already contains the correct path to the parent (e.g., ['admin-app', 'app-management'])
            await createMenuMutation.mutateAsync({
                menuData: menuPayload,
                navDocId: navDocId,
                parentKeys: parentPath
            });

            // Reset add mode
            setIsAddingChild(false);
            setNewChildData(null);
        } catch (error) {
            console.error('Failed to save BaseMenu:', error);
        }
    };

    if (!selectedItem) {
        return (
            <div style={styles.emptyState}>
                <BaseEmpty description="BaseSelect a BaseMenu item to edit" image={BaseEmpty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <div style={styles.formContainer}>
            {/* Action Header */}
            <div style={styles.formHeader}>
                <BaseButton
                    type="primary"
                    icon={isAddingChild ? <i className="ri-save-line" /> : <i className="ri-add-line" />}
                    onClick={isAddingChild ? handleSaveNewChild : handleAddChildClick}
                    shape="round"
                    size="small"
                    loading={createMenuMutation.isLoading}
                >
                    {isAddingChild ? 'Save' : 'Add Child'}
                </BaseButton>
                <BasePopconfirm
                    title="Delete BaseMenu item"
                    description="Are you sure you want to delete this item and all its children?"
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <BaseButton danger icon={<i className="ri-delete-bin-line" />} shape="round" size="small">
                        Delete
                    </BaseButton>
                </BasePopconfirm>
            </div>

            <BaseForm form={form} layout="vertical" onValuesChange={handleFieldChange} style={styles.form} size="middle" className="BaseMenu-editor-scrollbar">
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Basic Information</div>
                    <BaseForm.Item
                        label="Key"
                        name="key"
                        rules={[
                            { required: true, baseMessage: 'Key is required' },
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
                        <BaseInput placeholder="Enter unique key" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Label" name="label" rules={[{ required: true, baseMessage: 'Label is required' }]}>
                        <BaseInput placeholder="Enter label" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Description" name="description">
                        <TextArea placeholder="Enter description" rows={3} />
                    </BaseForm.Item>
                    <BaseForm.Item label="Section Title" name="sectionTitle">
                        <BaseInput placeholder="Enter section title (optional)" />
                    </BaseForm.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Routing & Navigation</div>
                    <BaseForm.Item label="Route" name="route">
                        <BaseInput placeholder="Enter route path" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Component" name="component">
                        <BaseInput placeholder="Enter component name" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Icon" name="icon">
                        <BaseInput placeholder="Enter icon class name" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Order Index" name="order_index">
                        <BaseInputNumber placeholder="Enter order" style={{ width: '100%' }} min={0} />
                    </BaseForm.Item>
                    <BaseForm.Item label="Level" name="level">
                        <BaseInputNumber placeholder="Level" style={{ width: '100%' }} disabled min={0} />
                    </BaseForm.Item>
                    <BaseForm.Item label="Visible" name="is_visible" valuePropName="checked">
                        <BaseSwitch />
                    </BaseForm.Item>
                    <BaseForm.Item label="Active" name="is_active" valuePropName="checked">
                        <BaseSwitch />
                    </BaseForm.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>BaseBadge Configuration</div>
                    <BaseForm.Item label="BaseBadge Type">
                        <BaseRadio.Group value={badgeType} onChange={handleBadgeTypeChange}>
                            <BaseRadio value="none">None</BaseRadio>
                            <BaseRadio value="string">String</BaseRadio>
                            <BaseRadio value="object">Object</BaseRadio>
                        </BaseRadio.Group>
                    </BaseForm.Item>

                    {badgeType === 'string' && (
                        <BaseForm.Item label="BaseBadge Text" name="badgeString">
                            <BaseInput placeholder="Enter BaseBadge text" />
                        </BaseForm.Item>
                    )}

                    {badgeType === 'object' && (
                        <>
                            <BaseForm.Item label="BaseBadge Count" name="badgeCount">
                                <BaseInput placeholder="Enter count" />
                            </BaseForm.Item>
                            <BaseForm.Item label="BaseBadge Color" name="badgeColor">
                                <BaseSelect placeholder="BaseSelect color">
                                    <BaseSelect.Option value="blue">Blue</BaseSelect.Option>
                                    <BaseSelect.Option value="green">Green</BaseSelect.Option>
                                    <BaseSelect.Option value="orange">Orange</BaseSelect.Option>
                                    <BaseSelect.Option value="purple">Purple</BaseSelect.Option>
                                    <BaseSelect.Option value="red">Red</BaseSelect.Option>
                                    <BaseSelect.Option value="cyan">Cyan</BaseSelect.Option>
                                    <BaseSelect.Option value="gold">Gold</BaseSelect.Option>
                                </BaseSelect>
                            </BaseForm.Item>
                        </>
                    )}
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Application Settings</div>
                    <BaseForm.Item label="Application ID" name="application_id">
                        <BaseInput placeholder="Enter application ID" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Application Name" name="application_name">
                        <BaseInput placeholder="Enter application name" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Application Version" name="application_version">
                        <BaseInput placeholder="Enter version" />
                    </BaseForm.Item>
                    <BaseForm.Item label="Application Status" name="application_status">
                        <BaseSelect placeholder="BaseSelect status">
                            <BaseSelect.Option value="active">Active</BaseSelect.Option>
                            <BaseSelect.Option value="inactive">Inactive</BaseSelect.Option>
                            <BaseSelect.Option value="development">Development</BaseSelect.Option>
                        </BaseSelect>
                    </BaseForm.Item>
                    <BaseForm.Item label="Object ID" name="object_id">
                        <BaseInput placeholder="Enter object ID" />
                    </BaseForm.Item>
                    <BaseForm.Item label="BaseMenu ID" name="menu_id">
                        <BaseInput placeholder="Auto-generated" disabled />
                    </BaseForm.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Metadata</div>
                    <BaseForm.Item label="BaseMenu Metadata (JSON)" name="menu_metadata">
                        <TextArea placeholder='{"key": "value"}' rows={4} />
                    </BaseForm.Item>
                </div>
            </BaseForm>
        </div>
    );
};

export default RoleForm;
