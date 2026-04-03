import { useState, useMemo, useEffect, useRef } from 'react';
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

// Create BuilderView with Ant Design components
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
 */
const DomainManagementScreen = () => {
    const [filters, setFilters] = useState({ search: '', status: '' });
    const debounceTimerRef = useRef(null);

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

    // Transform API response to form data
    const formData = useMemo(() => {
        if (!domainsResponse) return {};

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

        return {
            // Statistics
            totalCount: total.toString(),
            activeCount: active.toString(),
            pendingCount: pending.toString(),
            inactiveCount: inactive.toString(),

            // Table data
            domainsTable: tableData,

            // Filter values
            searchInput: filters.search,
            statusFilter: filters.status
        };
    }, [domainsResponse, filters]);

    // Load form schema from IndexedDB
    const getForm = async () => {
        const schema = await formDB.getFormSchema('DomainsView');
        return schema ? JSON.stringify(schema) : null;
    };

    // Handle form data changes (user interactions)
    const handleFormDataChange = ({ data }) => {
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
            if (newFilters.search !== filters.search || newFilters.status !== filters.status) {
                setFilters(newFilters);
            }
        }, 500);
    };

    // Custom actions for buttons
    const customActions = {
        onSearch: () => refetch(),
        onExport: () => console.log('Export domains'),
        onAddDomain: () => console.log('Add new domain'),
        onViewDomain: (e) => console.log('View domain:', e),
        onEditDomain: (e) => console.log('Edit domain:', e)
    };

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
                view={builderView}
                getForm={getForm}
                formName="DomainsView"
                initialData={formData}
                actions={customActions}
                onFormDataChange={handleFormDataChange}
            />
        </div>
    );
};

export default DomainManagementScreen;
