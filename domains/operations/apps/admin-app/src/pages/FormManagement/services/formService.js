import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Form Service - All form-related API calls
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
     * Get applications by domain ID
     * @param {string} domainId - Domain ID
     * @returns {Promise<Object>} Applications list
     */
    getApplicationsByDomain: async (domainId) => {
        console.log('Calling getApplicationsByDomain API with domainId:', domainId);
        const response = await axiosClient.get(`/applications/domain/${domainId}?skip=0&limit=100`);
        console.log('getApplicationsByDomain response:', response);
        return response;
    },

    /**
     * Get menus by application ID
     * @param {string} applicationId - Application ID
     * @returns {Promise<Object>} Menus list
     */
    getMenusByApplication: async (applicationId) => {
        console.log('Calling getMenusByApplication API with applicationId:', applicationId);
        const response = await axiosClient.get(`/applications/${applicationId}/menus?skip=0&limit=100&include_children=true`);
        console.log('getMenusByApplication response:', response);
        return response;
    },

    /**
     * Get forms by menu ID
     * @param {string} menuId - Menu ID
     * @returns {Promise<Object>} Forms data
     */
    getFormsByMenuId: async (menuId) => {
        console.log('Calling getFormsByMenuId API with menuId:', menuId);
        const response = await axiosClient.get(`/forms/menu/${menuId}?skip=0&limit=100`);
        console.log('getFormsByMenuId response:', response);
        return response;
    },

    /**
     * Save form to backend (Create)
     * @param {Object} payload - Form save payload
     * @param {string} payload.menu_id - Menu ID (UUID)
     * @param {Array} payload.access - Access permissions (e.g., ["read", "write"])
     * @param {Array} payload.forms - Array of form objects
     * @returns {Promise<Object>} Saved form response
     */
    saveForm: async (payload) => {
        if (!payload.menu_id) {
            throw new Error('menu_id is required');
        }

        return await axiosClient.post('/forms/', payload);
    },

    /**
     * Update form by form ID
     * @param {string} formId - Form ID (UUID)
     * @param {Object} payload - Form update payload (same structure as saveForm)
     * @returns {Promise<Object>} Updated form response
     */
    updateFormById: async (formId, payload) => {
        if (!formId) {
            throw new Error('formId is required');
        }

        return await axiosClient.put(`/forms/${formId}`, payload);
    },

    /**
     * Delete form by form ID
     * @param {string} formId - Form ID (UUID)
     * @returns {Promise<Object>} Delete response
     */
    deleteFormById: async (formId) => {
        if (!formId) {
            throw new Error('formId is required');
        }

        return await axiosClient.delete(`/forms/${formId}`);
    }
};

export default formService;
