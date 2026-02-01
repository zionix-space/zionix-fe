import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Menu Service - All menu-related API calls
 * Uses global axios client with built-in auth and error handling
 */
export const menuService = {
    /**
     * Get all menus
     * @returns {Promise<Object>} Menu configuration
     */
    getMenus: async () => {
        return await axiosClient.get('/menus');
    },

    /**
     * Get menu by ID
     * @param {string} menuId - Menu ID
     * @returns {Promise<Object>} Menu data
     */
    getMenuById: async (menuId) => {
        return await axiosClient.get(`/menus/${menuId}`);
    },

    /**
     * Create new menu
     * @param {Object} menuData - Menu data
     * @param {string} navDocId - Navigation document ID (from root _id)
     * @param {Array<string>} parentKeys - Parent keys array (path from root to parent)
     * @returns {Promise<Object>} Created menu
     */
    createMenu: async (menuData, navDocId, parentKeys) => {
        if (!navDocId || !parentKeys || parentKeys.length === 0) {
            throw new Error('navDocId and parentKeys are required');
        }

        const params = new URLSearchParams();
        params.append('nav_doc_id', navDocId);
        parentKeys.forEach(key => params.append('parent_keys', key));

        return await axiosClient.post(`/menus/?${params.toString()}`, menuData);
    },

    /**
     * Update existing menu
     * @param {string} menuId - Menu ID
     * @param {Object} menuData - Updated menu data
     * @returns {Promise<Object>} Updated menu
     */
    updateMenu: async (menuId, menuData) => {
        return await axiosClient.put(`/menus/${menuId}`, menuData);
    },

    /**
     * Delete menu
     * @param {string} menuId - Menu ID
     * @returns {Promise<void>}
     */
    deleteMenu: async (menuId) => {
        return await axiosClient.delete(`/menus/${menuId}`);
    },

    /**
     * Batch update menus - supports both reordering AND field updates
     * Updates multiple menus in a single transaction with support for:
     * - Reordering (order_index, parent_menu_id)
     * - Field updates (name, label, icon, route, component, etc.)
     * - Access permissions (access array)
     * - Navigation/UI fields (key, badge, section_title, object_id, description)
     * - Visibility and active status
     * - Metadata updates
     * 
     * @param {Array} menus - Array of menu objects from the tree structure
     * @param {string} applicationId - Application ID (optional, uses default if not provided)
     * @returns {Promise<Object>} Response with updated_count and items
     */
    batchUpdateMenus: async (menus, applicationId = null) => {
        // Flatten the menu tree structure and transform to API format
        const flattenMenus = (items, parentId = null, currentLevel = 0) => {
            const flattened = [];

            items.forEach((item, index) => {
                // Build the menu item payload
                const menuItem = {
                    menu_id: item.menu_id || item.key, // Use menu_id if available, fallback to key
                    order_index: item.order_index ?? index,
                    parent_menu_id: parentId,
                    name: item.name || item.label,
                    label: item.label,
                    level: item.level ?? currentLevel,
                    is_visible: item.is_visible ?? true,
                    is_active: item.is_active ?? true,
                };

                // Add optional fields only if they exist
                if (item.route) menuItem.route = item.route;
                if (item.component) menuItem.component = item.component;
                if (item.icon) menuItem.icon = item.icon;
                if (item.key) menuItem.key = item.key;
                if (item.badge) menuItem.badge = item.badge;
                if (item.section_title) menuItem.section_title = item.section_title;
                if (item.object_id) menuItem.object_id = item.object_id;
                if (item.description) menuItem.description = item.description;
                if (item.menu_metadata) menuItem.menu_metadata = item.menu_metadata;
                if (item.access && Array.isArray(item.access)) menuItem.access = item.access;

                // DO NOT include children in the payload - API expects flat array
                flattened.push(menuItem);

                // Recursively flatten children
                if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                    const childItems = flattenMenus(
                        item.children,
                        item.menu_id || item.key,
                        currentLevel + 1
                    );
                    flattened.push(...childItems);
                }
            });

            return flattened;
        };

        const items = flattenMenus(menus);

        const payload = {
            items,
            application_id: applicationId || "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Default UUID
        };

        return await axiosClient.put('menus/batch-update', payload);
    },

    /**
     * @deprecated Use batchUpdateMenus instead
     * Legacy bulk update method - kept for backward compatibility
     */
    bulkUpdateMenus: async (menus, applicationId = null) => {
        return await menuService.batchUpdateMenus(menus, applicationId);
    },
};

export default menuService;
