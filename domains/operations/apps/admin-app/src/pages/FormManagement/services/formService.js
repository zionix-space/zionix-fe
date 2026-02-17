import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Menu Service - All menu-related API calls
 * Uses global axios client with built-in auth and error handling
 */
export const formService = {
    /**
     * Get all domains
     * @returns {Promise<Object>} Domains list
     */
    getDomains: async () => {
        console.log('Calling getDomains API...');
        const response = await axiosClient.get(`/domains/?skip=0&limit=100`);
        console.log('getDomains response:', response);
        return response;
    },

    /**
     * Get menu by ID
     * @param {string} menuId - Menu ID
     * @returns {Promise<Object>} Menu data
     */
    getFormByMenuId: async (menuId) => {
        return await axiosClient.get(`/menus/${menuId}`);
    },

    /**
     * Create new menu
     * @param {Object} menuData - Menu data
     * @param {string} navDocId - Navigation document ID (from root _id)
     * @returns {Promise<Object>} Created menu
     */
    createForm: async (menuData, navDocId) => {
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
    updateForm: async (menuId, menuData, navDocId) => {
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
    deleteForm: async (menuId) => {
        return await axiosClient.delete(`/menus/${menuId}`);
    },
};

export default formService;
