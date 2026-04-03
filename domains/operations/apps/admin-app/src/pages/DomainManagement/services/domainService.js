import axiosClient from '@zionix/shared-utilities/shared/middleware/axiosCore';

/**
 * Domain Service - API calls for domain management
 */
export const domainService = {
    /**
     * Get all domains with filters
     */
    getDomains: async (filters = {}) => {
        const params = new URLSearchParams({
            skip: filters.skip || 0,
            limit: filters.limit || 100
        });

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);

        return await axiosClient.get(`/domains?${params.toString()}`);
    },

    /**
     * Get domain by ID
     */
    getDomainById: async (domainId) => {
        return await axiosClient.get(`/domains/${domainId}`);
    },

    /**
     * Create new domain
     */
    createDomain: async (domainData) => {
        return await axiosClient.post('/domains', domainData);
    },

    /**
     * Update domain
     */
    updateDomain: async (domainId, domainData) => {
        return await axiosClient.put(`/domains/${domainId}`, domainData);
    },

    /**
     * Delete domain
     */
    deleteDomain: async (domainId) => {
        return await axiosClient.delete(`/domains/${domainId}`);
    }
};
