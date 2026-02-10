import { useEffect, useState, useRef } from 'react';
import { BaseForm, BaseInput, BaseInputNumber, BaseSwitch, BaseEmpty, BaseButton, BasePopconfirm, BaseRadio, BaseSelect, baseMessage } from '@zionix-space/design-system';
import { useTheme } from '@zionix-space/design-system';
import { useStyles } from './MenuForm.style';
import { useCreateMenuMutation } from '../hooks/useMenuQuery';
import { getParentPath } from '../utils/menuTransformers';

const { TextArea } = BaseInput;

const MenuForm = ({ selectedKey, selectedItem, allMenuKeys, menuData, onChange, onDelete, onAddChild }) => {
    const { token } = useTheme();
    const [form] = BaseForm.useForm();
    const [badgeType, setBadgeType] = useState('none');
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

            console.log('=== MENU SELECTED ===');
            console.log('Selected key:', selectedKey);
            console.log('Selected item:', selectedItem);
            console.log('Selected item fields:', selectedItem ? Object.keys(selectedItem) : 'null');

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

                console.log('Form values set successfully');
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

        // Auto-generate key from label
        if (fieldName === 'label') {
            const generatedKey = fieldValue
                ? fieldValue.toLowerCase().replace(/\s+/g, '-')
                : '';

            // Only update the form field if we have a valid generated key
            // If label is empty, keep the current key in the form field
            if (generatedKey) {
                form.setFieldsValue({ key: generatedKey });
            }

            // Update only label in parent, don't update key if it's empty
            if (onChange && selectedKey) {
                if (generatedKey) {
                    onChange(selectedKey, { label: fieldValue, key: generatedKey });
                } else {
                    // Only update label, keep the existing key
                    onChange(selectedKey, { label: fieldValue });
                }
            }
            return;
        }

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

    const handleAddChildClick = () => {
        // Call the original onAddChild to create the child in the tree
        onAddChild();
    };

    const handleSaveClick = async () => {
        try {
            // Validate form
            await form.validateFields();

            // Get all form values
            const formValues = form.getFieldsValue();

            // Get nav_doc_id from menuData (root level _id)
            const navDocId = menuData?._id;
            if (!navDocId) {
                baseMessage.error('Navigation document ID not found. Please refresh the page.');
                return;
            }

            // Check if this is a new item (no menu_id means it hasn't been saved to backend yet)
            const isNewItem = !selectedItem?.menu_id;

            if (!isNewItem) {
                baseMessage.info('Updating existing menus is not implemented yet. Only new menu creation is supported.');
                return;
            }

            // Get parent path from root to the selected item's parent
            const parentPath = getParentPath(menuData, selectedKey);

            if (!parentPath || parentPath.length === 0) {
                baseMessage.error('Parent path not found. Cannot save menu.');
                return;
            }

            // Helper function to find menu item by key
            const findItemByKey = (items, key) => {
                for (const item of items) {
                    if (item.key === key) return item;
                    if (item.children) {
                        const found = findItemByKey(item.children, key);
                        if (found) return found;
                    }
                }
                return null;
            };

            // Get application_id from the root menu (first level in tree)
            const rootMenuKey = parentPath[0]; // First level is the application
            const rootMenu = findItemByKey(menuData.mainNavigation, rootMenuKey);
            const applicationId = rootMenu?.application_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6";

            // Get parent_menu_id from the direct parent (last item in parentPath)
            const parentMenuKey = parentPath[parentPath.length - 1]; // Direct parent
            const parentMenu = findItemByKey(menuData.mainNavigation, parentMenuKey);

            // Determine parent_menu_id:
            // - If parent is root level (application), parent_menu_id should be null
            // - If parent is a nested menu, use its menu_id
            let parentMenuId = null;
            if (parentMenu) {
                // Check if parent is root level (has application_id but no menu_id, or level is 1)
                const isRootLevel = !parentMenu.menu_id || parentMenu.level === 1;

                if (isRootLevel) {
                    parentMenuId = null; // Root level parent = null
                } else {
                    parentMenuId = parentMenu.menu_id; // Nested menu parent = menu_id
                }
            }

            console.log('=== PARENT MENU DEBUG ===');
            console.log('Parent path:', parentPath);
            console.log('Parent menu key:', parentMenuKey);
            console.log('Parent menu:', parentMenu);
            console.log('Is root level parent?', !parentMenu?.menu_id || parentMenu?.level === 1);
            console.log('Parent menu ID (null for root):', parentMenuId);
            console.log('Root menu:', rootMenu);
            console.log('Application ID:', applicationId);

            // Prepare badge value - must be string, not null
            let badgeValue = "";
            if (badgeType === 'string' && formValues.badgeString) {
                badgeValue = formValues.badgeString;
            } else if (badgeType === 'object' && formValues.badgeCount) {
                badgeValue = JSON.stringify({
                    count: formValues.badgeCount,
                    color: formValues.badgeColor || 'blue'
                });
            }

            // Parse menu_metadata
            let menuMetadata = {};
            try {
                menuMetadata = formValues.menu_metadata ? JSON.parse(formValues.menu_metadata) : {};
            } catch (e) {
                menuMetadata = {};
            }

            // Build the API payload for single menu creation - ALL fields required
            const menuPayload = {
                application_id: applicationId, // Use application_id from root menu
                name: formValues.label || "",
                key: selectedKey || "",
                section_title: formValues.sectionTitle || "",
                menus_description: formValues.description || "",
                label: formValues.label || "",
                route: formValues.route || "",
                badge: badgeValue || "",
                component: formValues.component || "",
                icon: formValues.icon || "",
                order_index: formValues.order_index ?? 0,
                level: formValues.level ?? 1,
                is_visible: formValues.is_visible ?? true,
                parent_menu_id: parentMenuId, // Use menu_id from parent menu
                menu_metadata: Object.keys(menuMetadata).length > 0 ? menuMetadata : {},
                is_active: formValues.is_active ?? true,
                access: ["read"],
                children: []
            };

            console.log('Saving menu with payload:', menuPayload);
            console.log('navDocId:', navDocId);

            // Call the create menu API - only navDocId needed
            await createMenuMutation.mutateAsync({
                menuData: menuPayload,
                navDocId: navDocId
            });

            // Success! The mutation hook will automatically:
            // 1. Invalidate the menu queries
            // 2. Trigger a refetch
            // 3. Show success message
            // The menu list will refresh and show the newly created menu with all backend data

        } catch (error) {
            console.error('Failed to save menu:', error);
            if (error.name !== 'ValidationError') {
                // Error message is already shown by the mutation hook
                console.error('Save error details:', error);
            }
        }
    };

    if (!selectedItem) {
        return (
            <div style={styles.emptyState}>
                <BaseEmpty description="BaseSelect a menu item to edit" image={BaseEmpty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <div style={styles.formContainer}>
            {/* Action Header */}
            <div style={styles.formHeader}>
                <BaseButton
                    type="primary"
                    icon={<i className="ri-save-line" />}
                    onClick={handleSaveClick}
                    shape="round"
                    size="middle"
                    loading={createMenuMutation.isLoading}
                    style={{ minWidth: '100px' }}
                >
                    Save
                </BaseButton>
                <BaseButton
                    type="default"
                    icon={<i className="ri-add-line" />}
                    onClick={handleAddChildClick}
                    shape="round"
                    size="middle"
                    style={{ minWidth: '120px' }}
                >
                    Add Child
                </BaseButton>
                <BasePopconfirm
                    title="Delete menu item"
                    description="Are you sure you want to delete this item and all its children?"
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <BaseButton
                        danger
                        icon={<i className="ri-delete-bin-line" />}
                        shape="round"
                        size="middle"
                        style={{ minWidth: '100px' }}
                    >
                        Delete
                    </BaseButton>
                </BasePopconfirm>
            </div>

            <BaseForm form={form} layout="vertical" onValuesChange={handleFieldChange} style={styles.form} size="middle" className="menu-editor-scrollbar">
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Basic Information</div>
                    <BaseForm.Item
                        label="Key"
                        name="key"
                        tooltip="Auto-generated from label"
                    >
                        <BaseInput placeholder="Auto-generated from label" disabled />
                    </BaseForm.Item>
                    <BaseForm.Item label="Label" name="label" rules={[{ required: true, message: 'Label is required' }]}>
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
                    <div style={styles.sectionTitle}>Badge Configuration</div>
                    <BaseForm.Item label="Badge Type">
                        <BaseRadio.Group value={badgeType} onChange={handleBadgeTypeChange}>
                            <BaseRadio value="none">None</BaseRadio>
                            <BaseRadio value="string">String</BaseRadio>
                            <BaseRadio value="object">Object</BaseRadio>
                        </BaseRadio.Group>
                    </BaseForm.Item>

                    {badgeType === 'string' && (
                        <BaseForm.Item label="Badge Text" name="badgeString">
                            <BaseInput placeholder="Enter badge text" />
                        </BaseForm.Item>
                    )}

                    {badgeType === 'object' && (
                        <>
                            <BaseForm.Item label="Badge Count" name="badgeCount">
                                <BaseInput placeholder="Enter count" />
                            </BaseForm.Item>
                            <BaseForm.Item label="Badge Color" name="badgeColor">
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
                    <BaseForm.Item label="Application ID" name="application_id" tooltip="Read-only system field">
                        <BaseInput placeholder="System managed" disabled />
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
                    <BaseForm.Item label="Object ID" name="object_id" tooltip="Auto-generated by backend">
                        <BaseInput placeholder="Auto-generated" disabled />
                    </BaseForm.Item>
                    <BaseForm.Item label="Menu ID" name="menu_id" tooltip="Auto-generated by backend">
                        <BaseInput placeholder="Auto-generated" disabled />
                    </BaseForm.Item>
                </div>

                <div style={styles.section}>
                    <div style={styles.sectionTitle}>Metadata</div>
                    <BaseForm.Item label="Menu Metadata (JSON)" name="menu_metadata">
                        <TextArea placeholder='{"key": "value"}' rows={4} />
                    </BaseForm.Item>
                </div>
            </BaseForm>
        </div>
    );
};

export default MenuForm;
