import { useState, useEffect, useMemo } from 'react';
import { BaseSpin, baseMessage, BaseButton, BaseModal, theme } from '@zionix-space/design-system';
import './RoleEditor.scss';
import TreeToolbar from './TreeToolbar';
import RoleTree from './RoleTree';
import RoleDetailsForm from './RoleDetailsForm';
import {
    transformToTreeData,
    extractAllKeys,
    findMenuItemByKey,
    updateMenuItemByKey,
    getAllExpandableKeys,
    filterMenuItems,
} from '../utils/roleTransformers';
import { useMenusQuery, useBulkUpdateMenusMutation } from '../hooks/useRoleQuery';

const { useToken } = theme;

const RoleEditor = ({ jsonPreviewOpen, onJsonPreviewClose, onMenuDataChange, isMobile }) => {
    const { token } = useToken();

    // React Query hooks
    const { data: apiMenuData, isLoading: loading, isError, error } = useMenusQuery();
    const bulkUpdateMutation = useBulkUpdateMenusMutation();

    // Add global scrollbar styles only
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .role-editor-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .role-editor-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .role-editor-scrollbar::-webkit-scrollbar-thumb {
                background: ${token.colorBorder};
                borderRadius: 10px;
            }
            .role-editor-scrollbar::-webkit-scrollbar-thumb:hover {
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
    const [isDirty, setIsDirty] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [accessLevels, setAccessLevels] = useState({}); // State for role access levels

    // Initialize menu data from API
    useEffect(() => {
        if (apiMenuData) {
            setMenuData(apiMenuData);
            if (onMenuDataChange) {
                onMenuDataChange(apiMenuData);
            }

            // Initialize access levels for all menu items from access array
            const initializeAccessLevels = (items, levels = {}) => {
                items.forEach(item => {
                    // Convert access array to access level string
                    // access: ["write"] or ["read"] or [] (empty = disabled/hidden)
                    let accessLevel = 'disabled';
                    if (item.access && Array.isArray(item.access) && item.access.length > 0) {
                        const accessValue = item.access[0].toLowerCase();
                        if (accessValue === 'write' || accessValue === 'full') {
                            accessLevel = 'full';
                        } else if (accessValue === 'read') {
                            accessLevel = 'read';
                        }
                    }
                    levels[item.key] = accessLevel;

                    if (item.children && item.children.length > 0) {
                        initializeAccessLevels(item.children, levels);
                    }
                });
                return levels;
            };

            if (apiMenuData.mainNavigation) {
                const initialLevels = initializeAccessLevels(apiMenuData.mainNavigation);
                setAccessLevels(initialLevels);
            }
        }
    }, [apiMenuData, onMenuDataChange]);

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
        baseMessage.success('Child menu item created');
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
        baseMessage.success('Menu item deleted');
    };

    const handleSave = () => {
        // Prevent multiple clicks - mutation handles loading state
        if (bulkUpdateMutation.isLoading) return;

        // Convert access levels object to access array format for API
        const convertAccessLevelsToArray = (items) => {
            return items.map(item => {
                const accessLevel = accessLevels[item.key] || 'disabled';
                let access = [];

                if (accessLevel === 'full') {
                    access = ['write']; // or ['full'] depending on your API
                } else if (accessLevel === 'read') {
                    access = ['read'];
                } else {
                    access = []; // disabled/hidden = empty array
                }

                return {
                    ...item,
                    access: access,
                    children: item.children && item.children.length > 0
                        ? convertAccessLevelsToArray(item.children)
                        : []
                };
            });
        };

        const updatedMenuData = {
            ...menuData,
            mainNavigation: convertAccessLevelsToArray(menuData.mainNavigation)
        };

        bulkUpdateMutation.mutate(updatedMenuData.mainNavigation, {
            onSuccess: () => {
                setIsDirty(false);
                // Clear history after successful save
                setHistory([]);
                setHistoryIndex(-1);
                baseMessage.success('Menus updated successfully');
            },
        });
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
            baseMessage.success('Menu configuration exported');
        } catch (error) {
            baseMessage.error('Failed to export menu configuration');
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
                    baseMessage.success('Menu configuration imported successfully');
                } catch (error) {
                    baseMessage.error('Failed to import: Invalid JSON format');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Handle access level change for a single node with strict inheritance
    const handleAccessChange = (nodeKey, accessLevel, cascade = true) => {
        if (!menuData?.mainNavigation) return;

        const newAccessLevels = { ...accessLevels };

        // Update the node itself
        newAccessLevels[nodeKey] = accessLevel;

        // Cascade to all children if enabled (Strict Inheritance)
        if (cascade) {
            const cascadeToChildren = (items, parentAccess) => {
                items.forEach(item => {
                    if (item.key === nodeKey && item.children && item.children.length > 0) {
                        const updateChildren = (children, maxAccess) => {
                            children.forEach(child => {
                                // Strict Inheritance: Child cannot have more access than parent
                                // If parent is 'read', child can only be 'read' or 'disabled'
                                // If parent is 'disabled', child must be 'disabled'

                                const currentChildAccess = newAccessLevels[child.key] || 'disabled';

                                if (maxAccess === 'disabled') {
                                    // Parent is disabled, all children must be disabled
                                    newAccessLevels[child.key] = 'disabled';
                                } else if (maxAccess === 'read') {
                                    // Parent is read, children can be read or disabled (not full)
                                    if (currentChildAccess === 'full') {
                                        newAccessLevels[child.key] = 'read'; // Downgrade from full to read
                                    } else {
                                        newAccessLevels[child.key] = accessLevel; // Set to parent's access level
                                    }
                                } else if (maxAccess === 'full') {
                                    // Parent is full, children can be anything
                                    newAccessLevels[child.key] = accessLevel; // Set to parent's access level
                                }

                                if (child.children && child.children.length > 0) {
                                    updateChildren(child.children, newAccessLevels[child.key]);
                                }
                            });
                        };
                        updateChildren(item.children, accessLevel);
                    } else if (item.children && item.children.length > 0) {
                        cascadeToChildren(item.children, parentAccess);
                    }
                });
            };

            cascadeToChildren(menuData.mainNavigation, accessLevel);
        }

        setAccessLevels(newAccessLevels);
        setIsDirty(true);
    };

    // Handle bulk access level change for all nodes
    const handleBulkAccessChange = (accessLevel) => {
        if (!menuData?.mainNavigation) return;

        const updateAllAccessLevels = (items, levels = {}) => {
            items.forEach(item => {
                levels[item.key] = accessLevel;
                if (item.children && item.children.length > 0) {
                    updateAllAccessLevels(item.children, levels);
                }
            });
            return levels;
        };

        const newAccessLevels = updateAllAccessLevels(menuData.mainNavigation);
        setAccessLevels(newAccessLevels);
        setIsDirty(true);
        baseMessage.success(`All access levels set to ${accessLevel}`);
    };

    const handleDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        // Prevent dropping on itself
        if (dragKey === dropKey) {
            baseMessage.warning('Cannot drop item on itself');
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
            baseMessage.error('Cannot move parent into its own child');
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
            baseMessage.error('Failed to find dragged item');
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
                baseMessage.success('Item moved successfully');
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
                baseMessage.success('Item reordered successfully');
            } else {
                baseMessage.error('Failed to reorder item');
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

    // Memoize menu data with current access levels for JSON preview
    const menuDataWithAccessLevels = useMemo(() => {
        if (!menuData?.mainNavigation) return menuData;

        const convertAccessLevelsToArray = (items) => {
            return items.map(item => {
                const accessLevel = accessLevels[item.key] || 'disabled';
                let access = [];

                if (accessLevel === 'full') {
                    access = ['write'];
                } else if (accessLevel === 'read') {
                    access = ['read'];
                } else {
                    access = [];
                }

                return {
                    ...item,
                    access: access,
                    children: item.children && item.children.length > 0
                        ? convertAccessLevelsToArray(item.children)
                        : []
                };
            });
        };

        return {
            ...menuData,
            mainNavigation: convertAccessLevelsToArray(menuData.mainNavigation)
        };
    }, [menuData, accessLevels]);

    if (loading) {
        return (
            <div className="role-editor-loading">
                <BaseSpin size="large">
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ marginTop: '8px', color: token.colorTextSecondary }}>
                            Loading menu configuration...
                        </div>
                    </div>
                </BaseSpin>
            </div>
        );
    }

    return (
        <div className="role-editor-container">
            {/* Two-column layout */}
            <div className="role-editor-two-column">
                {/* Left column - Tree */}
                <div className="role-editor-left-column">
                    <TreeToolbar
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange}
                        onExpandAll={handleExpandAll}
                        onCollapseAll={handleCollapseAll}
                        onSave={handleSave}
                        isDirty={isDirty}
                        saving={bulkUpdateMutation.isLoading}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onExport={handleExport}
                        onImport={handleImport}
                        onBulkAccessChange={handleBulkAccessChange}
                    />
                    <RoleTree
                        treeData={getTreeData()}
                        selectedKey={selectedKey}
                        expandedKeys={expandedKeys}
                        searchValue={searchValue}
                        onSelect={handleSelect}
                        onExpand={handleExpand}
                        onDrop={handleDrop}
                        accessLevels={accessLevels}
                        onAccessChange={handleAccessChange}
                        menuData={menuData}
                    />
                </div>

                {/* Right column - Form */}
                <div className="role-editor-right-column role-editor-scrollbar">
                    <RoleDetailsForm
                        selectedKey={selectedKey}
                        selectedItem={selectedItem}
                        accessLevels={accessLevels}
                        onAccessChange={handleAccessChange}
                        onFieldChange={handleFieldChange}
                    />
                </div>
            </div>

            {/* JSON Preview Modal */}
            <BaseModal
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
                        background: 'rgba(0, 0, 0, 0.05)',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        overflow: 'auto',
                        color: token.colorText,
                    }}
                >
                    {JSON.stringify(menuDataWithAccessLevels, null, 2)}
                </pre>
            </BaseModal>
        </div>
    );
};

export default RoleEditor;
