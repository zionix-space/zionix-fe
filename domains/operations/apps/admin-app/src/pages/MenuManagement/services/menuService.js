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
     * @returns {Promise<Object>} Created menu
     */
    createMenu: async (menuData) => {
        return await axiosClient.post('/menus', menuData);
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
