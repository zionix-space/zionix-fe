/**
 * Menu Validation Utilities
 * Validates menu items and menu structure integrity
 */

/**
 * Validates a menu item
 * @param {Object} item - Menu item to validate
 * @param {Array} allKeys - All existing keys in the menu
 * @returns {Array} Array of error messages (empty if valid)
 */
export const validateMenuItem = (item, allKeys = []) => {
    const errors = [];

    // Required field: key
    if (!item.key || item.key.trim() === '') {
        errors.push('Key is required');
    }

    // Required field: label
    if (!item.label || item.label.trim() === '') {
        errors.push('Label is required');
    }

    // Unique key validation
    if (item.key && allKeys.length > 0) {
        const duplicates = allKeys.filter((k) => k === item.key);
        if (duplicates.length > 1) {
            errors.push('Key must be unique');
        }
    }

    return errors;
};

/**
 * Checks if menu configuration has circular references
 * @param {Object} config - Menu configuration
 * @returns {boolean} True if circular references exist
 */
export const hasCircularReferences = (config) => {
    if (!config) return false;

    const visited = new Set();
    const recursionStack = new Set();

    const checkCircular = (items, parentKey = null) => {
        if (!items || !Array.isArray(items)) return false;

        for (const item of items) {
            if (!item.key) continue;

            // If we're already processing this node, we have a cycle
            if (recursionStack.has(item.key)) {
                return true;
            }

            // Mark as being processed
            recursionStack.add(item.key);

            // Check children
            if (item.children && item.children.length > 0) {
                if (checkCircular(item.children, item.key)) {
                    return true;
                }
            }

            // Done processing this node
            recursionStack.delete(item.key);
            visited.add(item.key);
        }

        return false;
    };

    // Check mainNavigation
    if (config.mainNavigation) {
        if (checkCircular(config.mainNavigation)) {
            return true;
        }
    }

    // Check profileSection
    if (config.profileSection && config.profileSection.menuItems) {
        if (checkCircular(config.profileSection.menuItems)) {
            return true;
        }
    }

    return false;
};

/**
 * Validates menu hierarchy structure
 * @param {Object} config - Menu configuration
 * @returns {boolean} True if hierarchy is valid
 */
export const isValidHierarchy = (config) => {
    if (!config) return false;

    const validateLevel = (items, expectedLevel) => {
        if (!items || !Array.isArray(items)) return true;

        for (const item of items) {
            // Check if level property matches expected depth
            if (item.level !== undefined && item.level !== expectedLevel) {
                return false;
            }

            // Recursively validate children
            if (item.children && item.children.length > 0) {
                if (!validateLevel(item.children, expectedLevel + 1)) {
                    return false;
                }
            }
        }

        return true;
    };

    // Validate mainNavigation (starts at level 0)
    if (config.mainNavigation) {
        if (!validateLevel(config.mainNavigation, 0)) {
            return false;
        }
    }

    // Validate profileSection (starts at level 0)
    if (config.profileSection && config.profileSection.menuItems) {
        if (!validateLevel(config.profileSection.menuItems, 0)) {
            return false;
        }
    }

    return true;
};

/**
 * Checks if a node is a descendant of another node
 * @param {Object} parentItem - Potential parent item
 * @param {string} childKey - Key of potential child
 * @returns {boolean} True if childKey is a descendant of parentItem
 */
export const isDescendant = (parentItem, childKey) => {
    if (!parentItem || !childKey) return false;

    const checkChildren = (item) => {
        if (!item.children || item.children.length === 0) {
            return false;
        }

        for (const child of item.children) {
            if (child.key === childKey) {
                return true;
            }
            if (checkChildren(child)) {
                return true;
            }
        }

        return false;
    };

    return checkChildren(parentItem);
};

/**
 * Validates JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} { valid: boolean, error: string|null, parsed: Object|null }
 */
export const validateJSON = (jsonString) => {
    if (!jsonString || jsonString.trim() === '') {
        return { valid: true, error: null, parsed: {} };
    }

    try {
        const parsed = JSON.parse(jsonString);
        return { valid: true, error: null, parsed };
    } catch (error) {
        return { valid: false, error: error.message, parsed: null };
    }
};
