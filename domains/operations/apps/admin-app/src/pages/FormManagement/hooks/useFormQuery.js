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
 * Hook to fetch form by ID
 * @param {string} formId - Form ID
 * @returns {Object} Query result with form data
 */
export const useFormQuery = (formId, options = {}) => {
    return useQuery({
        queryKey: formKeys.detail(formId),
        queryFn: () => formService.getFormById(formId),
        enabled: !!formId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to load form');
        },
        ...options,
    });
};

/**
 * Hook to create new form
 * @returns {Object} Mutation object
 */
export const useCreateFormMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => formService.createForm(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: formKeys.lists() });
            bannerMessage.success('Form created successfully!');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to create form');
        },
    });
};

/**
 * Hook to update form
 * @returns {Object} Mutation object
 */
export const useUpdateFormMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ formId, formData }) => formService.updateForm(formId, formData),
        onMutate: async ({ formId, formData }) => {
            await queryClient.cancelQueries({ queryKey: formKeys.detail(formId) });
            const previousForm = queryClient.getQueryData(formKeys.detail(formId));
            queryClient.setQueryData(formKeys.detail(formId), formData);
            return { previousForm, formId };
        },
        onError: (error, variables, context) => {
            if (context?.previousForm) {
                queryClient.setQueryData(
                    formKeys.detail(context.formId),
                    context.previousForm
                );
            }
            bannerMessage.error(error.message || 'Failed to update form');
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: formKeys.lists() });
            queryClient.invalidateQueries({ queryKey: formKeys.detail(variables.formId) });
            bannerMessage.success('Form updated successfully');
        },
    });
};

/**
 * Hook to delete form
 * @returns {Object} Mutation object
 */
export const useDeleteFormMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: formService.deleteForm,
        onSuccess: (data, formId) => {
            queryClient.removeQueries({ queryKey: formKeys.detail(formId) });
            queryClient.invalidateQueries({ queryKey: formKeys.all });
            bannerMessage.success('Form deleted successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to delete form');
        },
    });
};

