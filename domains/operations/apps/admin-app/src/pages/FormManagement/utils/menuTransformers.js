/**
 * Menu Data Transformation Utilities
 * Converts between MenuItem format and TreeNode format for Ant Design Tree
 */

/**
 * Transforms menu items array to Ant Design Tree data format
 * Uses menu_id (or application_id for root) as the tree key for stability
 * @param {Array} menuItems - Array of MenuItem objects
 * @returns {Array} Array of TreeNode objects
 */
export const transformToTreeData = (menuItems) => {
    if (!menuItems || !Array.isArray(menuItems)) {
        return [];
    }

    return menuItems.map((item) => {
        // Use menu_id as key, fallback to application_id for root level, then _tempId for new items
        const treeKey = item.menu_id || item.application_id || item._tempId || `fallback-${Date.now()}`;

        return {
            key: treeKey,
            title: item.label,
            icon: item.icon,
            badge: item.badge,
            children: item.children && item.children.length > 0
                ? transformToTreeData(item.children)
                : [],
            isLeaf: !item.children || item.children.length === 0,
            // Store original item data for reference
            data: item,
        };
    });
};

/**
 * Extracts all keys from menu configuration
 * @param {Object} config - Menu configuration object
 * @returns {Array} Array of all menu item keys
 */
export const extractAllKeys = (config) => {
    if (!config) return [];

    const keys = [];

    const extractFromItems = (items) => {
        if (!items || !Array.isArray(items)) return;

        items.forEach((item) => {
            if (item.key) {
                keys.push(item.key);
            }
            if (item.children && item.children.length > 0) {
                extractFromItems(item.children);
            }
        });
    };

    // Extract from mainNavigation
    if (config.mainNavigation) {
        extractFromItems(config.mainNavigation);
    }

    // Extract from profileSection
    if (config.profileSection && config.profileSection.menuItems) {
        extractFromItems(config.profileSection.menuItems);
    }

    return keys;
};

/**
 * Finds a menu item by its ID (menu_id, application_id, or temp key)
 * @param {Object} menuData - Complete menu configuration
 * @param {string} id - ID to search for (menu_id, application_id, or temp key)
 * @returns {Object|null} Found menu item or null
 */
export const findMenuItemByKey = (menuData, id) => {
    if (!menuData || !id) return null;

    const searchInItems = (items) => {
        if (!items || !Array.isArray(items)) return null;

        for (const item of items) {
            // Check menu_id, application_id, or _tempId (for new items)
            const itemId = item.menu_id || item.application_id || item._tempId;
            if (itemId === id) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const found = searchInItems(item.children);
                if (found) return found;
            }
        }
        return null;
    };

    // Search in mainNavigation
    if (menuData.mainNavigation) {
        const found = searchInItems(menuData.mainNavigation);
        if (found) return found;
    }

    // Search in profileSection
    if (menuData.profileSection && menuData.profileSection.menuItems) {
        const found = searchInItems(menuData.profileSection.menuItems);
        if (found) return found;
    }

    return null;
};

/**
 * Updates a menu item by its ID (menu_id, application_id, or temp key) with new properties
 * @param {Object} menuData - Complete menu configuration
 * @param {string} id - ID of item to update (menu_id, application_id, or temp key)
 * @param {Object} updates - Properties to update
 * @returns {Object} Updated menu configuration
 */
export const updateMenuItemByKey = (menuData, id, updates) => {
    if (!menuData || !id || !updates) return menuData;

    // Deep clone to avoid mutation
    const clonedData = JSON.parse(JSON.stringify(menuData));

    const updateInItems = (items) => {
        if (!items || !Array.isArray(items)) return false;

        for (let i = 0; i < items.length; i++) {
            // Check menu_id, application_id, or _tempId (for new items)
            const itemId = items[i].menu_id || items[i].application_id || items[i]._tempId;
            if (itemId === id) {
                // Update the item
                items[i] = { ...items[i], ...updates };
                return true;
            }
            if (items[i].children && items[i].children.length > 0) {
                const updated = updateInItems(items[i].children);
                if (updated) return true;
            }
        }
        return false;
    };

    // Update in mainNavigation
    if (clonedData.mainNavigation) {
        const updated = updateInItems(clonedData.mainNavigation);
        if (updated) return clonedData;
    }

    // Update in profileSection
    if (clonedData.profileSection && clonedData.profileSection.menuItems) {
        const updated = updateInItems(clonedData.profileSection.menuItems);
        if (updated) return clonedData;
    }

    return clonedData;
};

/**
 * Gets all expanded keys from menu data (all parent nodes)
 * Uses menu_id/application_id as keys
 * @param {Array} menuItems - Array of MenuItem objects
 * @returns {Array} Array of IDs that should be expanded
 */
export const getAllExpandableKeys = (menuItems) => {
    if (!menuItems || !Array.isArray(menuItems)) {
        return [];
    }

    const keys = [];

    const collectKeys = (items) => {
        items.forEach((item) => {
            if (item.children && item.children.length > 0) {
                // Use menu_id, application_id, or _tempId (for new items)
                const itemId = item.menu_id || item.application_id || item._tempId;
                if (itemId) {
                    keys.push(itemId);
                }
                collectKeys(item.children);
            }
        });
    };

    collectKeys(menuItems);
    return keys;
};

/**
 * Filters menu items based on search value
 * @param {Array} menuItems - Array of MenuItem objects
 * @param {string} searchValue - Search string
 * @returns {Object} Object with filteredItems and expandedKeys
 */
export const filterMenuItems = (menuItems, searchValue) => {
    if (!menuItems || !Array.isArray(menuItems) || !searchValue) {
        return { filteredItems: menuItems, expandedKeys: [] };
    }

    const lowerSearch = searchValue.toLowerCase();
    const expandedKeys = [];

    const filterRecursive = (items, parentKey = null) => {
        const filtered = [];

        items.forEach((item) => {
            const matches = item.label?.toLowerCase().includes(lowerSearch) ||
                item.description?.toLowerCase().includes(lowerSearch) ||
                item.key?.toLowerCase().includes(lowerSearch);

            let childResults = [];
            if (item.children && item.children.length > 0) {
                childResults = filterRecursive(item.children, item.key);
            }

            if (matches || childResults.length > 0) {
                filtered.push({
                    ...item,
                    children: childResults,
                });

                // Add to expanded keys if it has matching children
                if (childResults.length > 0) {
                    expandedKeys.push(item.key);
                }
            }
        });

        return filtered;
    };

    const filteredItems = filterRecursive(menuItems);
    return { filteredItems, expandedKeys };
};

/**
 * Gets the parent path (array of IDs) from root to a specific menu item
 * @param {Object} menuData - Complete menu configuration
 * @param {string} targetId - ID of the target menu item (menu_id, application_id, or _tempId)
 * @returns {Array} Array of parent IDs from root to target (excluding target itself)
 */
export const getParentPath = (menuData, targetId) => {
    if (!menuData || !targetId) return [];

    const findPath = (items, path = []) => {
        if (!items || !Array.isArray(items)) return null;

        for (const item of items) {
            // Get the item's ID (menu_id, application_id, or _tempId)
            const itemId = item.menu_id || item.application_id || item._tempId;

            if (itemId === targetId) {
                return path;
            }
            if (item.children && item.children.length > 0) {
                const found = findPath(item.children, [...path, itemId]);
                if (found) return found;
            }
        }
        return null;
    };

    // Search in mainNavigation
    if (menuData.mainNavigation) {
        const path = findPath(menuData.mainNavigation);
        if (path) return path;
    }

    return [];
};
