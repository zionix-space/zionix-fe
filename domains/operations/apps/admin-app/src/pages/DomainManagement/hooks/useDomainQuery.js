import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerMessage } from '@zionix-space/design-system';
import { domainService } from '../services/domainService';

/**
 * Query keys for domain-related queries
 */
export const domainKeys = {
    all: ['domains'],
    lists: () => [...domainKeys.all, 'list'],
    list: (filters) => [...domainKeys.lists(), { filters }],
    details: () => [...domainKeys.all, 'detail'],
    detail: (id) => [...domainKeys.details(), id],
};

/**
 * Hook to fetch domains with filters
 */
export const useDomainsQuery = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: domainKeys.list(filters),
        queryFn: () => domainService.getDomains(filters),
        staleTime: 2 * 60 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to load domains');
        },
        ...options,
    });
};

/**
 * Hook to create domain
 */
export const useCreateDomainMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (domainData) => domainService.createDomain(domainData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
            bannerMessage.success('Domain created successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to create domain');
        },
    });
};

/**
 * Hook to update domain
 */
export const useUpdateDomainMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ domainId, domainData }) => domainService.updateDomain(domainId, domainData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
            queryClient.invalidateQueries({ queryKey: domainKeys.detail(variables.domainId) });
            bannerMessage.success('Domain updated successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to update domain');
        },
    });
};

/**
 * Hook to delete domain
 */
export const useDeleteDomainMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (domainId) => domainService.deleteDomain(domainId),
        onSuccess: (data, domainId) => {
            queryClient.removeQueries({ queryKey: domainKeys.detail(domainId) });
            queryClient.invalidateQueries({ queryKey: domainKeys.all });
            bannerMessage.success('Domain deleted successfully');
        },
        onError: (error) => {
            bannerMessage.error(error.message || 'Failed to delete domain');
        },
    });
};
