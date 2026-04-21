import { useState, useEffect, useMemo, useRef } from 'react';
import { BaseSpin, bannerMessage, BaseModal, theme } from '@zionix-space/design-system';
import './MenuEditor.scss';
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
    getParentPath,
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

    // Use ref to track the last selected stable ID
    const lastSelectedStableIdRef = useRef(null);

    // Initialize menu data from API
    useEffect(() => {
        if (apiMenuData) {
            // Extract nav_doc_id from response (_id field at root level)
            if (apiMenuData._id) {
                setNavDocId(apiMenuData._id);
            }

            // Store the current selected item's details before updating data
            const currentSelectedItem = selectedKey && menuData ? findMenuItemByKey(menuData, selectedKey) : null;

            setMenuData(apiMenuData);

            // After data update, try to restore selection using the last stable ID
            if (lastSelectedStableIdRef.current) {
                // Find the item by its stable ID in the new data
                let restoredItem = findMenuItemByKey(apiMenuData, lastSelectedStableIdRef.current);

                // If not found and we had a temp ID, try to find the newly created item by label
                if (!restoredItem && lastSelectedStableIdRef.current.startsWith('temp-') && currentSelectedItem) {
                    // Find by matching label and level
                    const findByLabelAndLevel = (items) => {
                        for (const item of items) {
                            if (item.menu_id &&
                                item.label === currentSelectedItem.label &&
                                item.level === currentSelectedItem.level) {
                                return item;
                            }
                            if (item.children && item.children.length > 0) {
                                const found = findByLabelAndLevel(item.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    restoredItem = findByLabelAndLevel(apiMenuData.mainNavigation);
                }

                if (restoredItem) {
                    // Get the stable ID from the restored item (use menu_id for saved items)
                    const newStableId = restoredItem.menu_id || restoredItem.module_id || restoredItem.application_id;

                    // Update the ref with the new stable ID
                    lastSelectedStableIdRef.current = newStableId;

                    // Ensure parent nodes are expanded
                    const parentPath = getParentPath(apiMenuData, newStableId);
                    if (parentPath && parentPath.length > 0) {
                        setExpandedKeys(prev => {
                            const newKeys = [...new Set([...prev, ...parentPath])];
                            return newKeys;
                        });
                    }

                    // Use setTimeout to ensure state update happens after render
                    setTimeout(() => {
                        setSelectedKey(newStableId);
                    }, 50);
                }
            }

            if (onMenuDataChange) {
                onMenuDataChange(apiMenuData);
            }
        }
    }, [apiMenuData, onMenuDataChange]);

    // Track the stable ID whenever selection changes
    useEffect(() => {
        if (selectedKey && menuData) {
            const selectedItem = findMenuItemByKey(menuData, selectedKey);
            if (selectedItem) {
                // For stable ID, prioritize menu_id (saved items)
                // For new items without menu_id, use _tempId temporarily
                // DO NOT use module_id as it will select the wrong item (the module instead of the menu)
                const stableId = selectedItem.menu_id || selectedItem._tempId || selectedItem.application_id;
                if (stableId) {
                    lastSelectedStableIdRef.current = stableId;
                }
            }
        }
    }, [selectedKey, menuData]);

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

        // Inherit module_id from parent if the new item is level 3+
        // Level 2 is a module itself (gets module_id from backend)
        // Level 3+ are menus that belong to a module
        if (newItem.level >= 3) {
            // If parent is a module (level 2), use its module_id
            if (parentItem.level === 2 && parentItem.module_id) {
                newItem.module_id = parentItem.module_id;
            }
            // If parent is a menu (level 3+), inherit its module_id
            else if (parentItem.level >= 3 && parentItem.module_id) {
                newItem.module_id = parentItem.module_id;
            }
        }

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
        // Use setTimeout to ensure the state has updated before selecting
        setTimeout(() => {
            setSelectedKey(tempId);
        }, 0);

        bannerMessage.success('Child menu item created. Enter a label to generate the key.');
    };

    const handleDelete = async () => {
        if (!selectedKey) return;

        // Find the selected item
        const selectedItem = findMenuItemByKey(menuData, selectedKey);
        if (!selectedItem) {
            bannerMessage.error('Menu item not found');
            return;
        }

        // Find parent to select after delete
        const parentPath = getParentPath(menuData, selectedKey);
        const parentId = parentPath && parentPath.length > 0 ? parentPath[parentPath.length - 1] : null;

        // Check if this is a saved menu (has menu_id) or a new unsaved menu (_tempId)
        const isSavedMenu = !!selectedItem.menu_id;

        if (isSavedMenu) {
            // Delete from backend via API
            try {
                await deleteMenuMutation.mutateAsync(selectedItem.menu_id);
                // Success message and query invalidation handled by the mutation hook
                // The invalidation will trigger a refetch and update apiMenuData
                // which will then update menuData via the useEffect

                // After successful delete, select the parent
                if (parentId) {
                    // Wait a bit for the refetch to complete, then select parent
                    setTimeout(() => {
                        setSelectedKey(parentId);
                    }, 100);
                } else {
                    setSelectedKey(null);
                }
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

            // Select parent after delete
            if (parentId) {
                setSelectedKey(parentId);
            } else {
                setSelectedKey(null);
            }
            bannerMessage.success('Menu item removed');
        }
    };

    const handleSave = async () => {
        // Batch save/update - saves all menus at once
        if (saveMenusMutation.isLoading || updateMenuMutation.isLoading) return;

        if (!navDocId) {
            bannerMessage.error('Navigation document ID is missing. Please refresh the page.');
            return;
        }

        if (!menuData || !menuData.mainNavigation || menuData.mainNavigation.length === 0) {
            bannerMessage.error('No menu data to save');
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

                    // Add module_id if it exists (for level 2+ items)
                    if (menu.module_id) {
                        menuUpdateData.module_id = menu.module_id;
                    }

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
                    bannerMessage.success(`Successfully updated ${successCount} menu(s)`);
                    setIsDirty(false);
                    setHistory([]);
                    setHistoryIndex(-1);
                    setHasFieldChanges(false); // Reset field changes flag
                    refetch();
                } else {
                    bannerMessage.warning(`Updated ${successCount} menu(s), but ${errorCount} failed`);
                    refetch();
                }
            } catch (error) {
                bannerMessage.error('Failed to update menus: ' + (error.message || 'Unknown error'));
            }
        }
    };

    const handleReorder = async () => {
        // Reorder button - only calls reorder API with affected items
        if (reorderMenusMutation.isLoading) return;

        if (!menuData || !menuData.mainNavigation || menuData.mainNavigation.length === 0) {
            bannerMessage.error('No menu data to reorder');
            return;
        }

        if (affectedReorderItems.length === 0) {
            bannerMessage.warning('No items to reorder');
            return;
        }

        try {
            const applicationId = menuData.mainNavigation[0]?.application_id;

            if (!applicationId) {
                bannerMessage.error('Application ID not found');
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
            bannerMessage.error('Failed to reorder menus: ' + (error.message || 'Unknown error'));
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
            bannerMessage.success('Menu configuration exported');
        } catch (error) {
            bannerMessage.error('Failed to export menu configuration');
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
                    bannerMessage.success('Menu configuration imported successfully');
                } catch (error) {
                    bannerMessage.error('Failed to import: Invalid JSON format');
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
            bannerMessage.error('Failed to find items');
            return;
        }

        // Helper to find which module an item belongs to (returns module_id)
        const findModuleForItem = (itemKey) => {
            for (const app of menuData.mainNavigation) {
                // Search in the application's children
                const searchInChildren = (items, currentModule = null) => {
                    for (const item of items) {
                        const itemId = item.menu_id || item.module_id || item.application_id || item._tempId;

                        // Track the current module as we traverse
                        let moduleId = currentModule;
                        if (item.module_id && !item.menu_id) {
                            // This is a module (level 2)
                            moduleId = item.module_id;
                        }

                        if (itemId === itemKey) {
                            return moduleId;
                        }

                        if (item.children && item.children.length > 0) {
                            const found = searchInChildren(item.children, moduleId);
                            if (found !== null) return found;
                        }
                    }
                    return null;
                };

                const result = searchInChildren(app.children || []);
                if (result !== null) return result;
            }
            return null;
        };

        // Helper to find which application an item belongs to
        const findApplicationForItem = (itemKey) => {
            for (const app of menuData.mainNavigation) {
                // Check if the item is the application itself
                const appId = app.application_id || app.menu_id || app.module_id;
                if (appId === itemKey) {
                    return app.application_id;
                }

                // Search in the application's children
                const searchInChildren = (items) => {
                    for (const item of items) {
                        const itemId = item.menu_id || item.module_id || item.application_id || item._tempId;
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
            bannerMessage.error('Cannot move menus between different applications');
            return;
        }

        // Deep clone menu data
        const clonedData = JSON.parse(JSON.stringify(menuData));

        // Find and remove the dragged item using proper ID matching
        let draggedItem = null;
        const removeItem = (items) => {
            for (let i = 0; i < items.length; i++) {
                const itemId = items[i].menu_id || items[i].module_id || items[i].application_id || items[i]._tempId;
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
            bannerMessage.error('Failed to find dragged item');
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

                // Check if dropItem is a root-level application (has application_id but no menu_id/module_id)
                // or a module (has module_id but no menu_id)
                // If so, children should have parent_menu_id as null
                const isRootApplication = dropItem.application_id && !dropItem.menu_id && !dropItem.module_id;
                const isModule = dropItem.module_id && !dropItem.menu_id;
                draggedItem.parent_menu_id = (isRootApplication || isModule) ? null : dropItem.menu_id;

                // Update module_id for the dragged item based on new location
                // If dropping into a module (level 2), use that module's ID
                // If dropping into a menu (level 3+), find the parent module
                let newModuleId = null;
                if (isModule) {
                    // Dropping directly into a module
                    newModuleId = dropItem.module_id;
                } else if (!isRootApplication) {
                    // Dropping into a menu (level 3+), find its module
                    newModuleId = findModuleForItem(dropKey);
                }

                // Update the dragged item's module_id if it's a menu (level 3+)
                if (draggedItem.level >= 3 && newModuleId) {
                    draggedItem.module_id = newModuleId;
                }

                // Insert at the BEGINNING (index 0) when dropping on parent
                dropItem.children.unshift(draggedItem);

                // Update order_index for all children
                dropItem.children.forEach((item, idx) => {
                    item.order_index = (idx + 1) * 1000;
                });

                // Track affected items (all children of the parent) with module_id
                // Include items that have either menu_id (menus) or module_id (modules)
                const affectedItems = dropItem.children
                    .filter(item => item.menu_id || item.module_id) // Saved items (menus or modules)
                    .map(item => {
                        const affectedItem = {
                            order_index: item.order_index,
                            parent_menu_id: (isRootApplication || isModule) ? null : dropItem.menu_id,
                            level: item.level
                        };

                        // Use menu_id for menus, module_id for modules
                        if (item.menu_id) {
                            affectedItem.menu_id = item.menu_id;
                        } else if (item.module_id) {
                            affectedItem.menu_id = item.module_id; // API uses menu_id field for both
                        }

                        // Include module_id if present
                        if (item.module_id) {
                            affectedItem.module_id = item.module_id;
                        }

                        return affectedItem;
                    });

                setAffectedReorderItems(affectedItems);

                // Update the cloned data
                const updatedData = updateMenuItemByKey(clonedData, dropKey, dropItem);
                updateMenuData(updatedData);
                setExpandedKeys([...expandedKeys, dropKey]);
                setHasReorderChanges(true);
                bannerMessage.success('Item moved to top. Click "Reorder" to save changes.');
            }
        } else {
            // Drop between nodes (as sibling)
            const insertIntoItems = (items, parentLevel = -1, parentId = null, parentModuleId = null) => {
                for (let i = 0; i < items.length; i++) {
                    const itemId = items[i].menu_id || items[i].module_id || items[i].application_id || items[i]._tempId;
                    if (itemId === dropKey) {
                        const insertIndex = dropPosition === -1 ? i : i + 1;
                        draggedItem.level = parentLevel + 1;

                        // Update parent_menu_id for the dragged item
                        draggedItem.parent_menu_id = parentId;

                        // Update module_id for the dragged item if it's a menu (level 3+)
                        if (draggedItem.level >= 3 && parentModuleId) {
                            draggedItem.module_id = parentModuleId;
                        }

                        items.splice(insertIndex, 0, draggedItem);

                        // Update order_index for all items at this level (using increments of 1000)
                        items.forEach((item, idx) => {
                            item.order_index = (idx + 1) * 1000;
                        });

                        // Track affected items (all siblings at this level) with module_id
                        // Include items that have either menu_id (menus) or module_id (modules)
                        const affectedItems = items
                            .filter(item => item.menu_id || item.module_id) // Saved items (menus or modules)
                            .map(item => {
                                const affectedItem = {
                                    order_index: item.order_index,
                                    parent_menu_id: parentId,
                                    level: item.level
                                };

                                // Use menu_id for menus, module_id for modules
                                if (item.menu_id) {
                                    affectedItem.menu_id = item.menu_id;
                                } else if (item.module_id) {
                                    affectedItem.menu_id = item.module_id; // API uses menu_id field for both
                                }

                                // Include module_id if present
                                if (item.module_id) {
                                    affectedItem.module_id = item.module_id;
                                }

                                return affectedItem;
                            });

                        setAffectedReorderItems(affectedItems);

                        return true;
                    }
                    if (items[i].children && items[i].children.length > 0) {
                        // For root-level applications (has application_id but no menu_id/module_id), 
                        // or modules (has module_id but no menu_id),
                        // children should have parent_menu_id as null
                        const isRootApplication = items[i].application_id && !items[i].menu_id && !items[i].module_id;
                        const isModule = items[i].module_id && !items[i].menu_id;
                        const parentIdForChildren = (isRootApplication || isModule) ? null : (items[i].menu_id || items[i]._tempId);

                        // Track module_id as we traverse
                        let moduleIdForChildren = parentModuleId;
                        if (isModule) {
                            // This is a module, use its module_id for children
                            moduleIdForChildren = items[i].module_id;
                        }

                        if (insertIntoItems(items[i].children, items[i].level ?? 0, parentIdForChildren, moduleIdForChildren)) return true;
                    }
                }
                return false;
            };

            if (insertIntoItems(clonedData.mainNavigation)) {
                updateMenuData(clonedData);
                setHasReorderChanges(true); // Mark that reordering occurred
                bannerMessage.success('Item reordered successfully. Click "Reorder" to save changes.');
            } else {
                bannerMessage.error('Failed to reorder item');
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
            <div className="menu-editor-loading">
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
        <div className="menu-editor-container">
            {/* Two-column layout */}
            <div className="menu-editor-two-column">
                {/* Left column - Tree */}
                <div
                    className="menu-editor-left-column"
                    style={{
                        background: token.colorBgElevated,
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
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

                {/* Right column - Form */}
                <div
                    className="menu-editor-right-column menu-editor-scrollbar"
                    style={{
                        background: token.colorBgElevated,
                        border: `1px solid ${token.colorBorderSecondary}`
                    }}
                >
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
                        background: token.colorBgBase === '#000000' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
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
