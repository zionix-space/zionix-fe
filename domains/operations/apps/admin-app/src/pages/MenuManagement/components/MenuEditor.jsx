import { useState, useEffect, useMemo } from 'react';
import { Spin, message, theme, Button, Modal } from 'antd';
import { useStyles } from './MenuEditor.style';
import TreeToolbar from './TreeToolbar';
import MenuTree from './MenuTree';
import MenuForm from './MenuForm';
import {
    transformToTreeData,
    extractAllKeys,
    findMenuItemByKey,
    updateMenuItemByKey,
    getAllExpandableKeys,
    filterMenuItems,
} from '../utils/menuTransformers';
import { loadMenuConfiguration, saveMenuConfiguration } from '../services/menuApi';

const { useToken } = theme;

const MenuEditor = ({ jsonPreviewOpen, onJsonPreviewClose, onMenuDataChange }) => {
    const { token } = useToken();

    // Detect dark mode
    const isDarkMode =
        token.colorBgBase === '#000000' ||
        token.colorBgContainer === '#141414' ||
        token.colorBgElevated === '#1f1f1f' ||
        (token.colorBgContainer &&
            token.colorBgContainer.startsWith('#') &&
            parseInt(token.colorBgContainer.slice(1), 16) < 0x808080);

    const styles = useStyles(token, isDarkMode);

    // Add global scrollbar styles only
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .menu-editor-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .menu-editor-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .menu-editor-scrollbar::-webkit-scrollbar-thumb {
                background: ${token.colorBorder};
                borderRadius: 10px;
            }
            .menu-editor-scrollbar::-webkit-scrollbar-thumb:hover {
                background: ${token.colorBorderSecondary};
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, [token]);

    // State management
    const [menuData, setMenuData] = useState(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Add to history when menu data changes
    const addToHistory = (data) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(data)));

        // Keep only last 20 changes
        if (newHistory.length > 20) {
            newHistory.shift();
        } else {
            setHistoryIndex(historyIndex + 1);
        }

        setHistory(newHistory);
    };

    // Update menu data with history tracking
    const updateMenuData = (newData) => {
        addToHistory(newData);
        setMenuData(newData);
        setIsDirty(true);

        // Notify parent component
        if (onMenuDataChange) {
            onMenuDataChange(newData);
        }
    };

    // Load menu data from API
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setLoading(true);
                const data = await loadMenuConfiguration();
                setMenuData(data);
                if (onMenuDataChange) {
                    onMenuDataChange(data);
                }
            } catch (error) {
                message.error('Failed to load menu configuration');
                // Fallback to sample data with full structure
                const sampleData = {
                    "_id": "69074724f217ab8fcb2e3b24",
                    "mainNavigation": [
                        {
                            "key": "admin-app",
                            "label": "AdminApp",
                            "icon": "ri-admin-line",
                            "description": "Manage applications and configurations",
                            "badge": null,
                            "children": [
                                {
                                    "key": "app-management",
                                    "label": "AppSetup",
                                    "application_id": "c3140a19-c79e-4902-8591-2a7e7e944809",
                                    "icon": "ri-kanban-view-2",
                                    "description": "Manage applications and configurations",
                                    "badge": null,
                                    "sectionTitle": "App Management",
                                    "object_id": "string",
                                    "children": [
                                        {
                                            "key": "domains",
                                            "label": "Domains",
                                            "icon": null,
                                            "description": "Manage domain configurations",
                                            "badge": null,
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "apps",
                                            "label": "Apps",
                                            "icon": null,
                                            "description": "Application management",
                                            "badge": { "count": 5, "color": "blue" },
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "menus",
                                            "label": "Menus",
                                            "icon": null,
                                            "description": "Menu configuration and management",
                                            "badge": null,
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "forms",
                                            "label": "Forms",
                                            "icon": null,
                                            "description": "Form builder and management",
                                            "badge": { "count": 3, "color": "green" },
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "lowcode",
                                            "label": "Low Code Viewer",
                                            "icon": null,
                                            "description": "Low code form viewer",
                                            "badge": null,
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "buttons",
                                            "label": "Buttons",
                                            "icon": null,
                                            "description": "Button components and styles",
                                            "badge": null,
                                            "children": [],
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        }
                                    ],
                                    "route": "app-setup",
                                    "component": null,
                                    "order_index": 0,
                                    "level": 1,
                                    "is_visible": true,
                                    "is_active": true,
                                    "menu_metadata": {},
                                    "menu_id": "593fe78f-ba99-48cc-8d19-799f41995ab4",
                                    "icons": [{ "additionalProp1": {} }]
                                },
                                {
                                    "key": "client-management",
                                    "label": "Client setup",
                                    "application_id": "c3140a19-c79e-4902-8591-2a7e7e944809",
                                    "icon": "ri-id-card-line",
                                    "description": "Client and organizational management",
                                    "badge": null,
                                    "sectionTitle": "Client Management",
                                    "object_id": "string",
                                    "children": [
                                        {
                                            "key": "clients",
                                            "label": "Clients",
                                            "icon": null,
                                            "description": "Client information and management",
                                            "badge": { "count": 12, "color": "orange" },
                                            "children": [],
                                            "menu_id": "64cf9321-6469-44b8-8e2f-969466356ec0",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "entities-branches",
                                            "label": "Entities/Branches",
                                            "icon": null,
                                            "description": "Organizational entities and branches",
                                            "badge": null,
                                            "children": [],
                                            "menu_id": "a89826fc-e5a6-4479-8aca-b90cbd46d430",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "date-time",
                                            "label": "Date & Time",
                                            "icon": null,
                                            "description": "Date and time configurations",
                                            "badge": null,
                                            "children": [],
                                            "menu_id": "29ed3c69-329f-4c06-a0a3-e7f647a00666",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "department",
                                            "label": "Department",
                                            "icon": null,
                                            "description": "Department management",
                                            "badge": { "count": 8, "color": "purple" },
                                            "children": [],
                                            "menu_id": "6c1e81b2-2de4-4e95-a049-2f67521ca2a8",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "divisions",
                                            "label": "Divisions",
                                            "icon": null,
                                            "description": "Division and unit management",
                                            "badge": null,
                                            "children": [],
                                            "menu_id": "9a5dd30d-b4e5-454e-bfcb-56b5e99f48c7",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "job-code",
                                            "label": "Job Code",
                                            "icon": null,
                                            "description": "Job classification and codes",
                                            "badge": null,
                                            "children": [],
                                            "menu_id": "c487f4fa-4f8e-4d35-9972-e01ad9399f1b",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "authentication-policies",
                                            "label": "Authentication Policies",
                                            "icon": null,
                                            "description": "Security and authentication policies",
                                            "badge": { "count": 2, "color": "red" },
                                            "children": [],
                                            "menu_id": "90ee344a-5ecb-427c-bb11-3ce132efab66",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        }
                                    ],
                                    "route": "client-setup/",
                                    "component": null,
                                    "order_index": 0,
                                    "level": 1,
                                    "is_visible": true,
                                    "is_active": true,
                                    "menu_metadata": {},
                                    "menu_id": "c1882b1a-ee13-43c2-9025-d0ea5386b74d",
                                    "icons": [{ "additionalProp1": {} }]
                                },
                                {
                                    "key": "user-roles-management",
                                    "label": "User Roles setup",
                                    "application_id": "c3140a19-c79e-4902-8591-2a7e7e944809",
                                    "icon": "ri-shield-check-line",
                                    "description": "User roles and permissions management",
                                    "badge": null,
                                    "sectionTitle": "User Management",
                                    "object_id": "string",
                                    "children": [
                                        {
                                            "key": "roles",
                                            "label": "Roles",
                                            "icon": null,
                                            "description": "Role definitions and permissions",
                                            "badge": { "count": 6, "color": "cyan" },
                                            "children": [],
                                            "menu_id": "a57cf002-fa43-4eda-b639-e32c666d1364",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        },
                                        {
                                            "key": "users",
                                            "label": "Users",
                                            "icon": null,
                                            "description": "User accounts and management",
                                            "badge": { "count": 24, "color": "gold" },
                                            "children": [],
                                            "menu_id": "ee7bc1f9-ced8-47fd-9f35-0d1199422900",
                                            "level": 2,
                                            "is_visible": true,
                                            "is_active": true
                                        }
                                    ],
                                    "route": "user-roles-setup/",
                                    "component": null,
                                    "order_index": 0,
                                    "level": 1,
                                    "is_visible": true,
                                    "is_active": true,
                                    "menu_metadata": {},
                                    "menu_id": "a21b430f-c9e1-4ccc-abba-7002f1cb176a",
                                    "icons": [{ "additionalProp1": {} }]
                                }
                            ],
                            "route": "adminApp/",
                            "sectionTitle": "Application Configuration",
                            "application_id": "c3140a19-c79e-4902-8591-2a7e7e944809",
                            "application_name": "admin-app",
                            "application_version": "1.0",
                            "application_status": "active",
                            "object_id": "",
                            "level": 0,
                            "is_visible": true,
                            "is_active": true
                        }
                    ],
                    "profileSection": {
                        "type": "profile",
                        "key": "profile-section",
                        "userData": {
                            "name": "John Doe",
                            "email": "john@company.com",
                            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                            "role": "Administrator",
                            "status": "online"
                        },
                        "menuItems": [
                            {
                                "key": "profile",
                                "label": "Profile",
                                "icon": "ri-user-line",
                                "children": []
                            },
                            {
                                "key": "upgrade",
                                "label": "Upgrade to Pro",
                                "icon": "ri-star-line",
                                "badge": { "count": "NEW", "color": "gold" },
                                "children": []
                            },
                            {
                                "type": "divider",
                                "key": "profile-divider"
                            },
                            {
                                "key": "logout",
                                "label": "Logout",
                                "icon": "ri-logout-box-line",
                                "children": []
                            }
                        ]
                    },
                    "config": {
                        "version": "2.1.0",
                        "lastUpdated": "2024-01-15T10:30:00Z",
                        "dataHash": "abc123def456",
                        "defaultExpandedKeys": [],
                        "defaultSelectedKeys": [],
                        "theme": "light",
                        "mode": "inline",
                        "collapsible": true,
                        "selectable": true,
                        "multiple": false
                    }
                };
                setMenuData(sampleData);
                if (onMenuDataChange) {
                    onMenuDataChange(sampleData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, []);

    // Auto-expand matching nodes when search changes
    useEffect(() => {
        if (searchValue && menuData?.mainNavigation) {
            const { expandedKeys: searchExpandedKeys } = filterMenuItems(
                menuData.mainNavigation,
                searchValue
            );
            if (searchExpandedKeys.length > 0) {
                setExpandedKeys(searchExpandedKeys);
            }
        }
    }, [searchValue, menuData]);

    // Get filtered tree data
    const getTreeData = () => {
        if (!menuData || !menuData.mainNavigation) return [];

        if (searchValue) {
            const { filteredItems } = filterMenuItems(
                menuData.mainNavigation,
                searchValue
            );
            return transformToTreeData(filteredItems);
        }

        return transformToTreeData(menuData.mainNavigation);
    };

    // Handlers
    const handleSelect = (key) => {
        // Don't deselect if clicking the same item
        if (key === selectedKey) return;
        setSelectedKey(key);
    };

    const handleExpand = (keys) => {
        setExpandedKeys(keys);
    };

    const handleSearchChange = (value) => {
        setSearchValue(value);
    };

    const handleAddRoot = () => {
        const newItem = {
            key: `new-menu-${Date.now()}`,
            label: 'New Menu',
            icon: null,
            description: '',
            badge: null,
            children: [],
            level: 0,
            is_visible: true,
            is_active: true,
            order_index: menuData.mainNavigation.length,
        };

        const updatedData = {
            ...menuData,
            mainNavigation: [...menuData.mainNavigation, newItem],
        };

        updateMenuData(updatedData);
        setSelectedKey(newItem.key);
        message.success('Root menu item created');
    };

    const handleExpandAll = () => {
        if (menuData && menuData.mainNavigation) {
            const allKeys = getAllExpandableKeys(menuData.mainNavigation);
            setExpandedKeys(allKeys);
        }
    };

    const handleCollapseAll = () => {
        setExpandedKeys([]);
    };

    const handleFieldChange = (key, updates) => {
        const updatedData = updateMenuItemByKey(menuData, key, updates);
        updateMenuData(updatedData);

        // If the key field was changed, update selectedKey to the new key
        if (updates.key && updates.key !== key) {
            setSelectedKey(updates.key);
        }
    };

    const handleAddChild = () => {
        if (!selectedKey) return;

        const parentItem = findMenuItemByKey(menuData, selectedKey);
        if (!parentItem) return;

        const newItem = {
            key: `new-menu-${Date.now()}`,
            label: 'New Child Menu',
            icon: null,
            description: '',
            badge: null,
            children: [],
            level: (parentItem.level ?? 0) + 1,
            is_visible: true,
            is_active: true,
            order_index: parentItem.children ? parentItem.children.length : 0,
        };

        const updatedParent = {
            ...parentItem,
            children: [...(parentItem.children || []), newItem],
        };

        const updatedData = updateMenuItemByKey(menuData, selectedKey, updatedParent);
        updateMenuData(updatedData);
        setExpandedKeys([...expandedKeys, selectedKey]);
        setSelectedKey(newItem.key);
        message.success('Child menu item created');
    };

    const handleDelete = () => {
        if (!selectedKey) return;

        const deleteFromItems = (items) => {
            return items.filter((item) => {
                if (item.key === selectedKey) {
                    return false;
                }
                if (item.children && item.children.length > 0) {
                    item.children = deleteFromItems(item.children);
                }
                return true;
            });
        };

        const updatedData = {
            ...menuData,
            mainNavigation: deleteFromItems(menuData.mainNavigation),
        };

        updateMenuData(updatedData);
        setSelectedKey(null);
        message.success('Menu item deleted');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveMenuConfiguration(menuData);
            setIsDirty(false);
            // Clear history after successful save
            setHistory([]);
            setHistoryIndex(-1);
            message.success('Menu configuration saved successfully');
        } catch (error) {
            message.error('Failed to save menu configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setMenuData(JSON.parse(JSON.stringify(history[newIndex])));
            setIsDirty(true);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setMenuData(JSON.parse(JSON.stringify(history[newIndex])));
            setIsDirty(true);
        }
    };

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(menuData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `menu-configuration-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            message.success('Menu configuration exported');
        } catch (error) {
            message.error('Failed to export menu configuration');
        }
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);

                    // Basic validation
                    if (!importedData.mainNavigation || !Array.isArray(importedData.mainNavigation)) {
                        throw new Error('Invalid menu configuration format');
                    }

                    updateMenuData(importedData);
                    message.success('Menu configuration imported successfully');
                } catch (error) {
                    message.error('Failed to import: Invalid JSON format');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        // Prevent dropping on itself
        if (dragKey === dropKey) {
            message.warning('Cannot drop item on itself');
            return;
        }

        // Check for circular reference (dropping parent into its own child)
        const isDescendant = (parentKey, childKey) => {
            const parent = findMenuItemByKey(menuData, parentKey);
            if (!parent || !parent.children) return false;

            const checkChildren = (items) => {
                for (const item of items) {
                    if (item.key === childKey) return true;
                    if (item.children && item.children.length > 0) {
                        if (checkChildren(item.children)) return true;
                    }
                }
                return false;
            };

            return checkChildren(parent.children);
        };

        if (isDescendant(dragKey, dropKey)) {
            message.error('Cannot move parent into its own child');
            return;
        }

        // Deep clone menu data
        const clonedData = JSON.parse(JSON.stringify(menuData));

        // Find and remove the dragged item
        let draggedItem = null;
        const removeItem = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].key === dragKey) {
                    draggedItem = items.splice(i, 1)[0];
                    return true;
                }
                if (items[i].children && items[i].children.length > 0) {
                    if (removeItem(items[i].children)) return true;
                }
            }
            return false;
        };

        removeItem(clonedData.mainNavigation);

        if (!draggedItem) {
            message.error('Failed to find dragged item');
            return;
        }

        // Insert the dragged item at the new position
        if (!info.dropToGap) {
            // Drop on the node (as child)
            const dropItem = findMenuItemByKey(clonedData, dropKey);
            if (dropItem) {
                if (!dropItem.children) dropItem.children = [];
                draggedItem.level = (dropItem.level ?? 0) + 1;
                dropItem.children.push(draggedItem);

                // Update the cloned data
                const updatedData = updateMenuItemByKey(clonedData, dropKey, dropItem);
                updateMenuData(updatedData);
                setExpandedKeys([...expandedKeys, dropKey]);
                message.success('Item moved successfully');
            }
        } else {
            // Drop between nodes (as sibling)
            const insertIntoItems = (items, parentLevel = -1) => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].key === dropKey) {
                        const insertIndex = dropPosition === -1 ? i : i + 1;
                        draggedItem.level = parentLevel + 1;
                        items.splice(insertIndex, 0, draggedItem);

                        // Update order_index for all items at this level
                        items.forEach((item, idx) => {
                            item.order_index = idx;
                        });
                        return true;
                    }
                    if (items[i].children && items[i].children.length > 0) {
                        if (insertIntoItems(items[i].children, items[i].level ?? 0)) return true;
                    }
                }
                return false;
            };

            if (insertIntoItems(clonedData.mainNavigation)) {
                updateMenuData(clonedData);
                message.success('Item reordered successfully');
            } else {
                message.error('Failed to reorder item');
            }
        }
    };

    // Memoize selectedItem and allKeys to prevent unnecessary re-renders
    const selectedItem = useMemo(() => {
        return selectedKey ? findMenuItemByKey(menuData, selectedKey) : null;
    }, [selectedKey, menuData]);

    const allKeys = useMemo(() => {
        return extractAllKeys(menuData);
    }, [menuData]);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <Spin size="large" tip="Loading menu configuration..." />
            </div>
        );
    }

    return (
        <div style={styles.editorContainer}>
            {/* Two-column layout */}
            <div style={styles.twoColumnLayout}>
                {/* Left column - Tree */}
                <div style={styles.leftColumn}>
                    <TreeToolbar
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                        onExpandAll={handleExpandAll}
                        onCollapseAll={handleCollapseAll}
                        onSave={handleSave}
                        isDirty={isDirty}
                        saving={saving}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onExport={handleExport}
                        onImport={handleImport}
                    />
                    <MenuTree
                        treeData={getTreeData()}
                        selectedKey={selectedKey}
                        expandedKeys={expandedKeys}
                        searchValue={searchValue}
                        onSelect={handleSelect}
                        onExpand={handleExpand}
                        onDrop={handleDrop}
                    />
                </div>

                {/* Right column - Form */}
                <div style={styles.rightColumn} className="menu-editor-scrollbar">
                    <MenuForm
                        selectedKey={selectedKey}
                        selectedItem={selectedItem}
                        allMenuKeys={allKeys}
                        onChange={handleFieldChange}
                        onDelete={handleDelete}
                        onAddChild={handleAddChild}
                    />
                </div>
            </div>

            {/* JSON Preview Modal */}
            <Modal
                title="Menu Configuration JSON"
                open={jsonPreviewOpen}
                onCancel={onJsonPreviewClose}
                footer={null}
                width={800}
                styles={{
                    body: {
                        maxHeight: '70vh',
                        overflow: 'auto',
                    },
                }}
            >
                <pre
                    style={{
                        background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        overflow: 'auto',
                        color: token.colorText,
                    }}
                >
                    {JSON.stringify(menuData, null, 2)}
                </pre>
            </Modal>
        </div>
    );
};

export default MenuEditor;
