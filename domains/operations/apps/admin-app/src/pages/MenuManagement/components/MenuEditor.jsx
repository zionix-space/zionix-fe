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
import { useMenusQuery, useSaveMenusMutation } from '../hooks/useMenuQuery';

const { useToken } = theme;

const MenuEditor = ({ jsonPreviewOpen, onJsonPreviewClose, onMenuDataChange, isMobile }) => {
    const { token } = useToken();

    // React Query hooks
    const { data: apiMenuData, isLoading: loading, refetch } = useMenusQuery();
    const saveMenusMutation = useSaveMenusMutation();

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

    const handleFieldChange = (key, updates) => {
        const updatedData = updateMenuItemByKey(menuData, key, updates);
        updateMenuData(updatedData);

        // If the key field was changed, update selectedKey to the new key
        // Only update if the new key is not empty
        if (updates.key && updates.key !== key && updates.key.trim() !== '') {
            setSelectedKey(updates.key);
        }
    };

    const handleAddChild = () => {
        if (!selectedKey) return;

        const parentItem = findMenuItemByKey(menuData, selectedKey);
        if (!parentItem) return;

        // Use a temporary key that will be replaced when user types the label
        const tempKey = `temp-new-${Date.now()}`;

        const newItem = {
            key: tempKey,
            label: '',
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
        setSelectedKey(tempKey);
        baseMessage.success('Child menu item created. Enter a label to generate the key.');
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
        // Batch save/update - saves all menus at once
        if (saveMenusMutation.isLoading) return;

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
                refetch();
            },
        });
    };

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
                        saving={saveMenusMutation.isLoading}
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
