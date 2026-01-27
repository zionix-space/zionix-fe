import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseMessage } from '@zionix-space/design-system';
import { menuService } from '../services/menuService';

/**
 * Query keys for menu-related queries
 */
export const menuKeys = {
    all: ['menus'],
    lists: () => [...menuKeys.all, 'list'],
    list: (filters) => [...menuKeys.lists(), { filters }],
    details: () => [...menuKeys.all, 'detail'],
    detail: (id) => [...menuKeys.details(), id],
};

/**
 * Hook to fetch all menus
 * @returns {Object} Query result with menus data
 */
export const useMenusQuery = (options = {}) => {
    return useQuery({
        queryKey: menuKeys.lists(),
        queryFn: menuService.getMenus,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to load menus');
        },
        ...options,
    });
};

/**
 * Hook to fetch menu by ID
 * @param {string} menuId - Menu ID
 * @returns {Object} Query result with menu data
 */
export const useMenuQuery = (menuId, options = {}) => {
    return useQuery({
        queryKey: menuKeys.detail(menuId),
        queryFn: () => menuService.getMenuById(menuId),
        enabled: !!menuId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to load menu');
        },
        ...options,
    });
};

/**
 * Hook to create new menu
 * @returns {Object} Mutation object
 */
export const useCreateMenuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ menuData, navDocId, parentKeys }) =>
            menuService.createMenu(menuData, navDocId, parentKeys),
        onSuccess: (data) => {
            // Invalidate and refetch menus list
            queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
            baseMessage.success('Menu created successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to create menu');
        },
    });
};

/**
 * Hook to update menu
 * @returns {Object} Mutation object
 */
export const useUpdateMenuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ menuId, menuData }) => menuService.updateMenu(menuId, menuData),
        onMutate: async ({ menuId, menuData }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: menuKeys.detail(menuId) });

            // Snapshot previous value
            const previousMenu = queryClient.getQueryData(menuKeys.detail(menuId));

            // Optimistically update
            queryClient.setQueryData(menuKeys.detail(menuId), menuData);

            return { previousMenu, menuId };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousMenu) {
                queryClient.setQueryData(
                    menuKeys.detail(context.menuId),
                    context.previousMenu
                );
            }
            baseMessage.error(error.message || 'Failed to update menu');
        },
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
            queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.menuId) });
            baseMessage.success('Menu updated successfully');
        },
    });
};

/**
 * Hook to delete menu
 * @returns {Object} Mutation object
 */
export const useDeleteMenuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: menuService.deleteMenu,
        onSuccess: (data, menuId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: menuKeys.detail(menuId) });
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
            baseMessage.success('Menu deleted successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to delete menu');
        },
    });
};

/**
 * Hook to bulk update menus
 * @returns {Object} Mutation object
 */
export const useBulkUpdateMenusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: menuService.bulkUpdateMenus,
        onSuccess: () => {
            // Invalidate all menu queries
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
            baseMessage.success('Menus updated successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to update menus');
        },
    });
};
