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
     * Bulk update menus
     * @param {Array} menus - Array of menu objects
     * @returns {Promise<Object>} Updated menus
     */
    bulkUpdateMenus: async (menus) => {
        return await axiosClient.put('/menus/bulk', { menus });
    },
};

export default menuService;
