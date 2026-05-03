import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { BaseSpin } from '@zionix-space/design-system';
import { useDomainsQuery } from './hooks/useDomainQuery';
import { importDomainsViewSchema } from './utils/importSchema';
import {
    FormViewer,
    BuilderView,
    antdComponents,
    AntLocalizationWrapper,
    ltrCssLoader,
    rtlCssLoader,
    zionixlcAntdCssLoader,
    BiDi,
    formDB
} from '@zionix-space/lowcode';
import '@zionix-space/lowcode/styles';

// Create BuilderView with Ant Design components (singleton - created once)
const builderComponents = antdComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
    .withViewerWrapper(AntLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', zionixlcAntdCssLoader);

/**
 * Domain Management Screen
 * 
 * Architecture:
 * 1. Design: FormBuilder creates "DomainsView" form (pure UI, no code)
 * 2. API: React Query hooks fetch data from backend
 * 3. Transform: API response → form data structure
 * 4. Render: FormViewer displays form with injected data
 * 
 * Performance Strategy:
 * - Use FormViewer's ref to update ONLY table data without full re-render
 * - Filter inputs are controlled by FormViewer's internal state
 * - Only API response changes trigger table updates via setFieldsValue
 */
const DomainManagementScreen = () => {
    const [filters, setFilters] = useState({ search: '', status: '' });
    const debounceTimerRef = useRef(null);
    const viewerRef = useRef(null);

    // Auto-import form schema on first load
    useEffect(() => {
        importDomainsViewSchema();
    }, []);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Fetch domains from API
    const { data: domainsResponse, isLoading, refetch } = useDomainsQuery(filters);

    // Initial form data - only set once on mount
    const initialFormData = useMemo(() => ({
        searchInput: '',
        statusFilter: '',
        totalCount: '0',
        activeCount: '0',
        pendingCount: '0',
        inactiveCount: '0',
        domainsTable: []
    }), []);

    // Update ONLY table data when API response changes (no full re-render)
    useEffect(() => {
        if (!domainsResponse || !viewerRef.current) return;

        const domains = domainsResponse.data || domainsResponse || [];

        // Calculate statistics
        const total = domains.length;
        const active = domains.filter(d => d.status === 'Active').length;
        const pending = domains.filter(d => d.status === 'Pending').length;
        const inactive = domains.filter(d => d.status === 'Inactive').length;

        // Transform for table
        const tableData = domains.map(domain => ({
            key: domain.id || domain._id,
            domainId: domain.id || domain._id,
            domainName: domain.name,
            description: domain.description || 'No description',
            status: domain.status || 'Active'
        }));

        // Update ONLY the data fields, not filter inputs
        // This prevents full FormViewer re-render
        viewerRef.current.setFieldsValue({
            totalCount: total.toString(),
            activeCount: active.toString(),
            pendingCount: pending.toString(),
            inactiveCount: inactive.toString(),
            domainsTable: tableData
        });
    }, [domainsResponse]);

    // Load form schema from localStorage (stable reference)
    const getForm = useCallback(async () => {
        const schema = await formDB.getFormSchema('DomainsView');
        return schema ? JSON.stringify(schema) : null;
    }, []);

    // Handle form data changes (user interactions) - stable reference
    const handleFormDataChange = useCallback(({ data }) => {
        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Debounced filter update
        debounceTimerRef.current = setTimeout(() => {
            const newFilters = {
                search: data.searchInput || '',
                status: data.statusFilter || ''
            };

            // Only update if filters changed
            setFilters(prevFilters => {
                if (newFilters.search !== prevFilters.search || newFilters.status !== prevFilters.status) {
                    return newFilters;
                }
                return prevFilters;
            });
        }, 500);
    }, []);

    // Custom actions for buttons (stable reference)
    const customActions = useMemo(() => ({
        onSearch: () => refetch(),
        onExport: () => console.log('Export domains'),
        onAddDomain: () => console.log('Add new domain'),
        onViewDomain: (e) => console.log('View domain:', e),
        onEditDomain: (e) => console.log('Edit domain:', e)
    }), [refetch]);

    if (isLoading && !domainsResponse) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <BaseSpin size="large" />
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', overflow: 'auto' }}>
            <FormViewer
                ref={viewerRef}
                view={builderView}
                getForm={getForm}
                formName="DomainsView"
                initialData={initialFormData}
                actions={customActions}
                onFormDataChange={handleFormDataChange}
            />
        </div>
    );
};

export default DomainManagementScreen;
