import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseMessage } from '@zionix-space/design-system';
import { roleService, menuService } from '../services/roleService';

/**
 * Query keys for Role-related queries
 */
export const roleKeys = {
    all: ['roles'],
    lists: () => [...roleKeys.all, 'list'],
    list: (filters) => [...roleKeys.lists(), { filters }],
    details: () => [...roleKeys.all, 'detail'],
    detail: (id) => [...roleKeys.details(), id],
};

/**
 * Hook to fetch all roles
 * @returns {Object} Query result with roles data
 */
export const useRolesQuery = (options = {}) => {
    return useQuery({
        queryKey: roleKeys.lists(),
        queryFn: roleService.getRoles,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Prevent refetch on mount if data exists
        refetchOnReconnect: false, // Prevent refetch on reconnect
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to load roles');
        },
        ...options,
    });
};

/**
 * Hook to fetch Role by ID
 * @param {string} roleId - Role ID
 * @returns {Object} Query result with Role data
 */
export const useRoleQuery = (roleId, options = {}) => {
    return useQuery({
        queryKey: roleKeys.detail(roleId),
        queryFn: () => roleService.getRoleById(roleId),
        enabled: !!roleId,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to load Role');
        },
        ...options,
    });
};

/**
 * Hook to create new Role
 * @returns {Object} Mutation object
 */
export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roleService.createRole,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
            baseMessage.success('Role created successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to create Role');
        },
    });
};

/**
 * Hook to update Role
 * @returns {Object} Mutation object
 */
export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ roleId, roleData }) => roleService.updateRole(roleId, roleData),
        onMutate: async ({ roleId, roleData }) => {
            await queryClient.cancelQueries({ queryKey: roleKeys.detail(roleId) });
            const previousRole = queryClient.getQueryData(roleKeys.detail(roleId));
            queryClient.setQueryData(roleKeys.detail(roleId), roleData);
            return { previousRole, roleId };
        },
        onError: (error, variables, context) => {
            if (context?.previousRole) {
                queryClient.setQueryData(
                    roleKeys.detail(context.roleId),
                    context.previousRole
                );
            }
            baseMessage.error(error.message || 'Failed to update Role');
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
            queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleId) });
            baseMessage.success('Role updated successfully');
        },
    });
};

/**
 * Hook to delete Role
 * @returns {Object} Mutation object
 */
export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: roleService.deleteRole,
        onSuccess: (data, roleId) => {
            queryClient.removeQueries({ queryKey: roleKeys.detail(roleId) });
            queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
            baseMessage.success('Role deleted successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to delete Role');
        },
    });
};

/**
 * Query keys for BaseMenu-related queries
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
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Prevent refetch on mount if data exists
        refetchOnReconnect: false, // Prevent refetch on reconnect
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to load menus');
        },
        ...options,
    });
};

/**
 * Hook to fetch BaseMenu by ID
 * @param {string} menuId - BaseMenu ID
 * @returns {Object} Query result with BaseMenu data
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
            baseMessage.error(error.message || 'Failed to load BaseMenu');
        },
        ...options,
    });
};

/**
 * Hook to create new BaseMenu
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
            baseMessage.success('BaseMenu created successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to create BaseMenu');
        },
    });
};

/**
 * Hook to update BaseMenu
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
            baseMessage.error(error.message || 'Failed to update BaseMenu');
        },
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
            queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.menuId) });
            baseMessage.success('BaseMenu updated successfully');
        },
    });
};

/**
 * Hook to delete BaseMenu
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
            baseMessage.success('BaseMenu deleted successfully');
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to delete BaseMenu');
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
            // Invalidate all BaseMenu queries
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
            // Message will be shown by the component calling this mutation
        },
        onError: (error) => {
            baseMessage.error(error.message || 'Failed to update menus');
        },
    });
};
