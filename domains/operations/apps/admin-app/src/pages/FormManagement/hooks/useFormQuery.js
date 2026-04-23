import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerMessage } from '@zionix-space/design-system';
import { formService } from '../services/formService';

/**
 * Query keys for form-related queries
 * Hierarchical structure for efficient cache invalidation
 */
export const formKeys = {
    all: ['forms'],
    lists: () => [...formKeys.all, 'list'],
    list: (filters) => [...formKeys.lists(), { filters }],
    details: () => [...formKeys.all, 'detail'],
    detail: (id) => [...formKeys.details(), id],
    domains: () => [...formKeys.all, 'domains'],
    applications: (domainId) => [...formKeys.all, 'applications', domainId],
    menus: (applicationId) => [...formKeys.all, 'menus', applicationId],
};

/**
 * Hook to fetch all forms
 * @returns {Object} Query result with forms data
 */
export const useFormsQuery = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: formKeys.list(filters),
        queryFn: () => formService.getDomains(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to load forms');
        },
        ...options,
    });
};

/**
 * Hook to fetch domains
 * @returns {Object} Query result with domains data
 */
export const useDomainsQuery = (options = {}) => {
    return useQuery({
        queryKey: formKeys.domains(),
        queryFn: formService.getDomains,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to load domains');
        },
        ...options,
    });
};

/**
 * Hook to save form to backend (Create)
 * @returns {Object} Mutation object
 */
export const useSaveFormMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => formService.saveForm(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.all });
            bannerMessage.success('Form saved successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to save form');
        },
    });
};

/**
 * Hook to update form by form ID
 * @returns {Object} Mutation object
 */
export const useUpdateFormByIdMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ formId, payload }) => formService.updateFormById(formId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.all });
            bannerMessage.success('Form updated successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to update form');
        },
    });
};

/**
 * Hook to delete form by form ID
 * @returns {Object} Mutation object
 */
export const useDeleteFormByIdMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formId) => formService.deleteFormById(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.all });
            bannerMessage.success('Form deleted successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to delete form');
        },
    });
};


/**
 * Hook to fetch applications by domain ID
 * @param {string} domainId - Domain ID
 * @returns {Object} Query result with applications data
 */
export const useApplicationsQuery = (domainId, options = {}) => {
    console.log('useApplicationsQuery hook called with domainId:', domainId);

    const result = useQuery({
        queryKey: formKeys.applications(domainId),
        queryFn: () => formService.getApplicationsByDomain(domainId),
        enabled: !!domainId,  // Only fetch if domainId exists
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            console.error('useApplicationsQuery error:', error);
            bannerMessage.error(error.message || 'Failed to load applications');
        },
        ...options,
    });

    console.log('useApplicationsQuery result:', result);
    return result;
};

/**
 * Hook to fetch forms by menu ID
 * @param {string} menuId - Menu ID
 * @returns {Object} Query result with forms data
 */
export const useFormsByMenuQuery = (menuId, options = {}) => {
    console.log('useFormsByMenuQuery hook called with menuId:', menuId);

    const result = useQuery({
        queryKey: [...formKeys.all, 'byMenu', menuId],
        queryFn: () => formService.getFormsByMenuId(menuId),
        enabled: !!menuId,
        staleTime: 0, // Always fetch fresh data
        cacheTime: 0, // Don't cache results
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            console.error('useFormsByMenuQuery error:', error);
            bannerMessage.error(error.message || 'Failed to load forms');
        },
        ...options,
    });

    console.log('useFormsByMenuQuery result:', result);
    return result;
};
export const useMenusQuery = (applicationId, options = {}) => {
    console.log('useMenusQuery hook called with applicationId:', applicationId);

    const result = useQuery({
        queryKey: formKeys.menus(applicationId),
        queryFn: () => formService.getMenusByApplication(applicationId),
        enabled: !!applicationId,  // Only fetch if applicationId exists
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            console.error('useMenusQuery error:', error);
            bannerMessage.error(error.message || 'Failed to load menus');
        },
        ...options,
    });

    console.log('useMenusQuery result:', result);
    return result;
};
