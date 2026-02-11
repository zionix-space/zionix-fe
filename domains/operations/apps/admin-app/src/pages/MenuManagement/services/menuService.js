import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Menu Service - All menu-related API calls
 * Uses global axios client with built-in auth and error handling
 */
export const menuService = {
    /**
     * Get all menus
     * @returns {Promise<Object>} Menu configuration with _id (nav_doc_id)
     */
    getMenus: async () => {
        const response = await axiosClient.get('/menus');
        // Store the nav_doc_id from response for later use in save operations
        return response;
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
     * @returns {Promise<Object>} Created menu
     */
    createMenu: async (menuData, navDocId) => {
        if (!navDocId) {
            throw new Error('navDocId is required');
        }

        const params = new URLSearchParams();
        params.append('nav_doc_id', navDocId);

        return await axiosClient.post(`/menus/?${params.toString()}`, menuData);
    },

    /**
     * Update existing menu
     * @param {string} menuId - Menu ID
     * @param {Object} menuData - Updated menu data
     * @param {string} navDocId - Navigation document ID (required)
     * @returns {Promise<Object>} Updated menu
     */
    updateMenu: async (menuId, menuData, navDocId) => {
        if (!navDocId) {
            throw new Error('nav_doc_id is required for updating menu');
        }

        const params = new URLSearchParams();
        params.append('nav_doc_id', navDocId);

        return await axiosClient.put(`/menus/${menuId}?${params.toString()}`, menuData);
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
     * Save menus - supports both single and batch creation/update
     * POST endpoint that handles:
     * - Single menu creation
     * - Batch (multiple parents) menu creation
     * 
     * @param {Array} menus - Array of menu objects from the tree structure
     * @param {string} navDocId - Navigation document ObjectId from GET response (_id field)
     * @param {string} applicationId - Application ID (optional, uses default if not provided)
     * @returns {Promise<Object>} Response with created/updated menus
     */
    saveMenus: async (menus, navDocId, applicationId = null) => {
        if (!navDocId) {
            throw new Error('nav_doc_id is required for saving menus');
        }

        // Transform menu tree to API format - children should be nested
        const transformMenuForAPI = (item) => {
            const menuItem = {
                name: item.name || item.key || item.label,
                label: item.label,
            };

            // Add optional fields only if they exist
            if (item.key) menuItem.key = item.key;
            if (item.route) menuItem.route = item.route;
            if (item.component) menuItem.component = item.component;
            if (item.icon) menuItem.icon = item.icon;
            if (item.badge) menuItem.badge = item.badge;
            if (item.section_title) menuItem.section_title = item.section_title;
            if (item.menus_description || item.description) {
                menuItem.menus_description = item.menus_description || item.description;
            }
            if (item.menu_metadata) menuItem.menu_metadata = item.menu_metadata;
            if (item.access && Array.isArray(item.access)) {
                menuItem.access = item.access;
            }
            if (item.order_index !== undefined) menuItem.order_index = item.order_index;
            if (item.level !== undefined) menuItem.level = item.level;
            if (item.is_visible !== undefined) menuItem.is_visible = item.is_visible;
            if (item.is_active !== undefined) menuItem.is_active = item.is_active;

            // Recursively transform children
            if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                menuItem.children = item.children.map(child => transformMenuForAPI(child));
            } else {
                menuItem.children = [];
            }

            return menuItem;
        };

        // Build payload based on number of root menus
        let payload;

        if (menus.length === 1) {
            // Single menu format - use application_id from the menu itself or parameter
            const appId = menus[0].application_id || applicationId || "3fa85f64-5717-4562-b3fc-2c963f66afa6";
            payload = {
                application_id: appId,
                ...transformMenuForAPI(menus[0])
            };
        } else {
            // Batch format (multiple parents) - use application_id from first menu or parameter
            const appId = menus[0]?.application_id || applicationId || "3fa85f64-5717-4562-b3fc-2c963f66afa6";
            payload = {
                application_id: appId,
                menus: menus.map(menu => transformMenuForAPI(menu))
            };
        }

        // Add nav_doc_id as query parameter
        const params = new URLSearchParams();
        params.append('nav_doc_id', navDocId);

        return await axiosClient.post(`/menus/?${params.toString()}`, payload);
    },
};

export default menuService;
