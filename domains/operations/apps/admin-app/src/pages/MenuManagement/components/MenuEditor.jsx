import { useState, useEffect, useMemo } from 'react';
import { BaseSpin, baseMessage, BaseButton, BaseModal, theme } from '@zionix-space/design-system';
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
import { useMenusQuery, useSaveMenusMutation, useDeleteMenuMutation, useUpdateMenuMutation, useReorderMenusMutation } from '../hooks/useMenuQuery';

const { useToken } = theme;

const MenuEditor = ({ jsonPreviewOpen, onJsonPreviewClose, onMenuDataChange, isMobile }) => {
    const { token } = useToken();

    // React Query hooks
    const { data: apiMenuData, isLoading: loading, refetch } = useMenusQuery();
    const saveMenusMutation = useSaveMenusMutation();
    const updateMenuMutation = useUpdateMenuMutation();
    const deleteMenuMutation = useDeleteMenuMutation();
    const reorderMenusMutation = useReorderMenusMutation();

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
    const [navDocId, setNavDocId] = useState(null); // Store nav_doc_id from API response
    const [selectedKey, setSelectedKey] = useState(null);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [hasReorderChanges, setHasReorderChanges] = useState(false); // Track if reordering happened
    const [hasFieldChanges, setHasFieldChanges] = useState(false); // Track if field updates happened
    const [affectedReorderItems, setAffectedReorderItems] = useState([]); // Track only affected items during reorder

    // Initialize menu data from API
    useEffect(() => {
        if (apiMenuData) {
            // Extract nav_doc_id from response (_id field at root level)
            if (apiMenuData._id) {
                setNavDocId(apiMenuData._id);
            }
            setMenuData(apiMenuData);
            if (onMenuDataChange) {
                onMenuDataChange(apiMenuData);
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

    const handleFieldChange = (id, updates) => {
        const updatedData = updateMenuItemByKey(menuData, id, updates);
        updateMenuData(updatedData);
        setHasFieldChanges(true); // Mark that field changes occurred

        // No need to update selectedKey or expandedKeys since we're using stable IDs (menu_id/application_id)
        // The tree will maintain its state correctly even when label/key fields change
    };

    const handleAddChild = () => {
        if (!selectedKey) return;

        const parentItem = findMenuItemByKey(menuData, selectedKey);
        if (!parentItem) return;

        // Generate a unique temporary ID for the new item (will be replaced by backend menu_id after save)
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newItem = {
            key: '', // Key field starts empty, will be generated from label
            label: '',
            icon: null,
            description: '',
            badge: null,
            children: [],
            level: (parentItem.level ?? 0) + 1,
            is_visible: true,
            is_active: true,
            order_index: parentItem.children ? (parentItem.children.length + 1) * 1000 : 1000,
            _tempId: tempId, // Temporary ID for tree tracking (not sent to backend)
        };

        const updatedParent = {
            ...parentItem,
            children: [...(parentItem.children || []), newItem],
        };

        const updatedData = updateMenuItemByKey(menuData, selectedKey, updatedParent);
        updateMenuData(updatedData);

        // Ensure parent is expanded - add if not already in expandedKeys
        setExpandedKeys(prevKeys => {
            if (!prevKeys.includes(selectedKey)) {
                return [...prevKeys, selectedKey];
            }
            return prevKeys;
        });

        // Select the new item using its temp ID
        setSelectedKey(tempId);
        baseMessage.success('Child menu item created. Enter a label to generate the key.');
    };

    const handleDelete = async () => {
        if (!selectedKey) return;

        // Find the selected item
        const selectedItem = findMenuItemByKey(menuData, selectedKey);
        if (!selectedItem) {
            baseMessage.error('Menu item not found');
            return;
        }

        // Check if this is a saved menu (has menu_id) or a new unsaved menu (_tempId)
        const isSavedMenu = !!selectedItem.menu_id;

        if (isSavedMenu) {
            // Delete from backend via API
            try {
                await deleteMenuMutation.mutateAsync(selectedItem.menu_id);
                // Success message and query invalidation handled by the mutation hook
                // The invalidation will trigger a refetch and update apiMenuData
                // which will then update menuData via the useEffect
                setSelectedKey(null);
            } catch (error) {
                // Error message handled by the mutation hook
                console.error('Delete failed:', error);
            }
        } else {
            // New unsaved menu - just remove from local state
            const deleteFromItems = (items) => {
                return items.filter((item) => {
                    // Check menu_id, application_id, or _tempId
                    const itemId = item.menu_id || item.application_id || item._tempId;
                    if (itemId === selectedKey) {
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
            baseMessage.success('Menu item removed');
        }
    };

    const handleSave = async () => {
        // Batch save/update - saves all menus at once
        if (saveMenusMutation.isLoading || updateMenuMutation.isLoading) return;

        if (!navDocId) {
            baseMessage.error('Navigation document ID is missing. Please refresh the page.');
            return;
        }

        if (!menuData || !menuData.mainNavigation || menuData.mainNavigation.length === 0) {
            baseMessage.error('No menu data to save');
            return;
        }

        // Check if there are any new menus (keys starting with 'new-menu-')
        const hasNewMenus = (items) => {
            for (const item of items) {
                if (item.key && item.key.startsWith('new-menu-')) return true;
                if (item.children && hasNewMenus(item.children)) return true;
            }
            return false;
        };

        const isCreating = hasNewMenus(menuData.mainNavigation);

        if (isCreating) {
            // Use POST for batch save (creating new menus)
            saveMenusMutation.mutate({
                menus: menuData.mainNavigation,
                navDocId: navDocId,
                applicationId: null
            }, {
                onSuccess: () => {
                    setIsDirty(false);
                    setHistory([]);
                    setHistoryIndex(-1);
                    setHasReorderChanges(false);
                    setHasFieldChanges(false);
                    refetch();
                },
            });
        } else {
            // Use PUT for updating existing menus - update each menu individually
            try {
                // Flatten all menus (including nested children) into a single array with parent tracking
                const flattenMenus = (items, parentId = null) => {
                    const flattened = [];
                    items.forEach(item => {
                        flattened.push({ ...item, parent_menu_id: parentId });
                        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                            flattened.push(...flattenMenus(item.children, item.menu_id || item.key));
                        }
                    });
                    return flattened;
                };

                const allMenus = flattenMenus(menuData.mainNavigation);

                // Update each menu individually
                let successCount = 0;
                let errorCount = 0;

                for (const menu of allMenus) {
                    const menuId = menu.menu_id || menu.key;

                    // Skip if it's a new menu (shouldn't happen in update flow, but just in case)
                    if (!menuId || menuId.startsWith('new-menu-')) continue;

                    // Prepare menu data for update - matching swagger request body structure exactly
                    const menuUpdateData = {
                        application_id: menu.application_id || menuData.mainNavigation[0]?.application_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        name: menu.name || menu.label,
                        label: menu.label,
                        route: menu.route || "",
                        component: menu.component || "",
                        icon: menu.icon || "",
                        order_index: menu.order_index !== undefined ? menu.order_index : 0,
                        level: menu.level !== undefined ? menu.level : 0,
                        is_visible: menu.is_visible !== undefined ? menu.is_visible : true,
                        parent_menu_id: menu.parent_menu_id || null,
                        is_active: menu.is_active !== undefined ? menu.is_active : true,
                        access: menu.access && Array.isArray(menu.access) ? menu.access : [],
                        key: menu.key || "",
                        badge: menu.badge || "",
                        section_title: menu.section_title || "",
                        menus_description: menu.menus_description || menu.description || "",
                        children: []
                    };

                    try {
                        await updateMenuMutation.mutateAsync({
                            menuId: menuId,
                            menuData: menuUpdateData,
                            navDocId: navDocId
                        });
                        successCount++;
                    } catch (error) {
                        console.error(`Failed to update menu ${menuId}:`, error);
                        errorCount++;
                    }
                }

                // Show success/error messages
                if (errorCount === 0) {
                    baseMessage.success(`Successfully updated ${successCount} menu(s)`);
                    setIsDirty(false);
                    setHistory([]);
                    setHistoryIndex(-1);
                    setHasFieldChanges(false); // Reset field changes flag
                    refetch();
                } else {
                    baseMessage.warning(`Updated ${successCount} menu(s), but ${errorCount} failed`);
                    refetch();
                }
            } catch (error) {
                baseMessage.error('Failed to update menus: ' + (error.message || 'Unknown error'));
            }
        }
    };

    const handleReorder = async () => {
        // Reorder button - only calls reorder API with affected items
        if (reorderMenusMutation.isLoading) return;

        if (!menuData || !menuData.mainNavigation || menuData.mainNavigation.length === 0) {
            baseMessage.error('No menu data to reorder');
            return;
        }

        if (affectedReorderItems.length === 0) {
            baseMessage.warning('No items to reorder');
            return;
        }

        try {
            const applicationId = menuData.mainNavigation[0]?.application_id;

            if (!applicationId) {
                baseMessage.error('Application ID not found');
                return;
            }

            // Use the tracked affected items from drag-drop
            await reorderMenusMutation.mutateAsync({
                applicationId: applicationId,
                items: affectedReorderItems
            });

            // Reset reorder changes flag and affected items after success
            setHasReorderChanges(false);
            setAffectedReorderItems([]);
            setIsDirty(false);
            refetch();

        } catch (error) {
            console.error('Reorder API failed:', error);
            baseMessage.error('Failed to reorder menus: ' + (error.message || 'Unknown error'));
        }
    }

    // Determine button label based on whether there are new items
    const getBatchSaveButtonLabel = () => {
        if (!menuData || !menuData.mainNavigation) return 'Batch Save';

        const hasNewMenus = (items) => {
            for (const item of items) {
                if (item.key && item.key.startsWith('new-menu-')) return true;
                if (item.children && hasNewMenus(item.children)) return true;
            }
            return false;
        };

        return hasNewMenus(menuData.mainNavigation) ? 'Batch Save' : 'Batch Update';
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
        const BaseInput = document.createElement('BaseInput');
        BaseInput.type = 'file';
        BaseInput.accept = '.json';
        BaseInput.onchange = (e) => {
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
        BaseInput.click();
    };

    const handleDrop = (info) => {
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        // Find the dragged item and drop target
        const draggedItemOriginal = findMenuItemByKey(menuData, dragKey);
        const dropItemOriginal = findMenuItemByKey(menuData, dropKey);

        if (!draggedItemOriginal || !dropItemOriginal) {
            baseMessage.error('Failed to find items');
            return;
        }

        // Helper to find which application an item belongs to
        const findApplicationForItem = (itemKey) => {
            for (const app of menuData.mainNavigation) {
                // Check if the item is the application itself
                const appId = app.application_id || app.menu_id;
                if (appId === itemKey) {
                    return app.application_id;
                }

                // Search in the application's children
                const searchInChildren = (items) => {
                    for (const item of items) {
                        const itemId = item.menu_id || item.application_id || item._tempId;
                        if (itemId === itemKey) {
                            return app.application_id;
                        }
                        if (item.children && item.children.length > 0) {
                            const found = searchInChildren(item.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const result = searchInChildren(app.children || []);
                if (result) return result;
            }
            return null;
        };

        const draggedAppId = findApplicationForItem(dragKey);
        const dropAppId = findApplicationForItem(dropKey);

        // Prevent moving menus between different applications
        if (draggedAppId && dropAppId && draggedAppId !== dropAppId) {
            baseMessage.error('Cannot move menus between different applications');
            return;
        }

        // Deep clone menu data
        const clonedData = JSON.parse(JSON.stringify(menuData));

        // Find and remove the dragged item using proper ID matching
        let draggedItem = null;
        const removeItem = (items) => {
            for (let i = 0; i < items.length; i++) {
                const itemId = items[i].menu_id || items[i].application_id || items[i]._tempId;
                if (itemId === dragKey) {
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
            // Drop on the node (as child) - put at the beginning
            const dropItem = findMenuItemByKey(clonedData, dropKey);
            if (dropItem) {
                if (!dropItem.children) dropItem.children = [];

                // Update level and parent for dragged item
                draggedItem.level = (dropItem.level ?? 0) + 1;

                // Check if dropItem is a root-level application (has application_id but no menu_id)
                // If so, children should have parent_menu_id as null (root level inside application)
                const isRootApplication = dropItem.application_id && !dropItem.menu_id;
                draggedItem.parent_menu_id = isRootApplication ? null : dropItem.menu_id;

                // Insert at the BEGINNING (index 0) when dropping on parent
                dropItem.children.unshift(draggedItem);

                // Update order_index for all children
                dropItem.children.forEach((item, idx) => {
                    item.order_index = (idx + 1) * 1000;
                });

                // Track affected items (all children of the parent)
                const affectedItems = dropItem.children
                    .filter(item => item.menu_id) // Only saved items
                    .map(item => ({
                        menu_id: item.menu_id,
                        order_index: item.order_index,
                        parent_menu_id: isRootApplication ? null : dropItem.menu_id,
                        level: item.level
                    }));

                setAffectedReorderItems(affectedItems);

                // Update the cloned data
                const updatedData = updateMenuItemByKey(clonedData, dropKey, dropItem);
                updateMenuData(updatedData);
                setExpandedKeys([...expandedKeys, dropKey]);
                setHasReorderChanges(true);
                baseMessage.success('Item moved to top. Click "Reorder" to save changes.');
            }
        } else {
            // Drop between nodes (as sibling)
            const insertIntoItems = (items, parentLevel = -1, parentId = null) => {
                for (let i = 0; i < items.length; i++) {
                    const itemId = items[i].menu_id || items[i].application_id || items[i]._tempId;
                    if (itemId === dropKey) {
                        const insertIndex = dropPosition === -1 ? i : i + 1;
                        draggedItem.level = parentLevel + 1;

                        // Update parent_menu_id for the dragged item
                        draggedItem.parent_menu_id = parentId;

                        items.splice(insertIndex, 0, draggedItem);

                        // Update order_index for all items at this level (using increments of 1000)
                        items.forEach((item, idx) => {
                            item.order_index = (idx + 1) * 1000;
                        });

                        // Track affected items (all siblings at this level)
                        const affectedItems = items
                            .filter(item => item.menu_id) // Only saved items
                            .map(item => ({
                                menu_id: item.menu_id,
                                order_index: item.order_index,
                                parent_menu_id: parentId,
                                level: item.level
                            }));

                        setAffectedReorderItems(affectedItems);

                        return true;
                    }
                    if (items[i].children && items[i].children.length > 0) {
                        // For root-level applications (has application_id but no menu_id), 
                        // children should have parent_menu_id as null
                        const isRootApplication = items[i].application_id && !items[i].menu_id;
                        const parentIdForChildren = isRootApplication ? null : (items[i].menu_id || items[i]._tempId);
                        if (insertIntoItems(items[i].children, items[i].level ?? 0, parentIdForChildren)) return true;
                    }
                }
                return false;
            };

            if (insertIntoItems(clonedData.mainNavigation)) {
                updateMenuData(clonedData);
                setHasReorderChanges(true); // Mark that reordering occurred
                baseMessage.success('Item reordered successfully. Click "Reorder" to save changes.');
            } else {
                baseMessage.error('Failed to reorder item');
            }
        }
    }

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
                        saveButtonLabel={getBatchSaveButtonLabel()}
                        isDirty={isDirty}
                        saving={saveMenusMutation.isLoading || updateMenuMutation.isLoading}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onExport={handleExport}
                        onImport={handleImport}
                        onReorder={handleReorder}
                        hasReorderChanges={hasReorderChanges}
                        reordering={reorderMenusMutation.isLoading}
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

                {/* Right column - BaseForm */}
                <div style={styles.rightColumn} className="menu-editor-scrollbar">
                    <MenuForm
                        selectedKey={selectedKey}
                        selectedItem={selectedItem}
                        allMenuKeys={allKeys}
                        menuData={menuData}
                        onChange={handleFieldChange}
                        onDelete={handleDelete}
                        onAddChild={handleAddChild}
                        onRefetch={refetch}
                        isDeleting={deleteMenuMutation.isLoading}
                    />
                </div>
            </div>

            {/* JSON Preview BaseModal */}
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
            </BaseModal>
        </div>
    );
};

export default MenuEditor;
