import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Role Service - All role-related API calls
 * Uses global axios client with built-in auth and error handling
 */
export const roleService = {
    /**
     * Get all roles
     * @param {Object} params - Query parameters
     * @param {number} params.skip - Number of records to skip (default: 0)
     * @param {number} params.limit - Number of records to return (default: 100)
     * @param {boolean} params.active_only - Filter by active status (default: false)
     * @returns {Promise<Array>} List of roles
     */
    getRoles: async (params = {}) => {
        const { skip = 0, limit = 100, active_only = false } = params;
        return await axiosClient.get(`/user-roles/?skip=${skip}&limit=${limit}&active_only=${active_only}`);
    },

    /**
     * Get role by ID
     * @param {string} roleId - Role ID
     * @returns {Promise<Object>} Role data
     */
    getRoleById: async (roleId) => {
        return await axiosClient.get(`/user-roles/${roleId}`);
    },

    /**
     * Create new role
     * @param {Object} roleData - Role data
     * @returns {Promise<Object>} Created role
     */
    createRole: async (roleData) => {
        return await axiosClient.post('/user-roles/', roleData);
    },

    /**
     * Update existing role
     * @param {string} roleId - Role ID
     * @param {Object} roleData - Updated role data
     * @returns {Promise<Object>} Updated role
     */
    updateRole: async (roleId, roleData) => {
        return await axiosClient.put(`/user-roles/${roleId}`, roleData);
    },

    /**
     * Delete role
     * @param {string} roleId - Role ID
     * @returns {Promise<void>}
     */
    deleteRole: async (roleId) => {
        return await axiosClient.delete(`/user-roles/${roleId}`);
    },
};

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

export default { roleService, menuService };
