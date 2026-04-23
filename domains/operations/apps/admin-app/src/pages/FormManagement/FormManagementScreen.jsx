import { useState, useEffect, useMemo, useCallback } from 'react';
import { BaseSelect, BaseSpace, BaseTreeSelect, BasePopover, BaseButton, BaseBadge, baseMessage, useTheme } from '@zionix-space/design-system';
import { useDomainsQuery, useApplicationsQuery, useMenusQuery, useSaveFormMutation, useFormsByMenuQuery, useUpdateFormByIdMutation, useDeleteFormByIdMutation } from './hooks/useFormQuery';
import {
    FormBuilder,
    BuilderView,
    antdComponents,
    AntLocalizationWrapper,
    ltrCssLoader,
    rtlCssLoader,
    zionixlcAntdCssLoader,
    BiDi,
    useFormBuilderStore
} from '@zionix-space/lowcode';
import '@zionix-space/lowcode/styles';

// Create BuilderView with all Ant Design components
const builderComponents = antdComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
    .withViewerWrapper(AntLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', zionixlcAntdCssLoader);

/**
 * Form Management Screen
 * Manages forms per menu - NO IndexedDB, pure React state
 */
const FormManagementScreen = () => {
    const { token, isDarkMode } = useTheme();
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

    // Store forms in React state - NO IndexedDB
    const [currentForms, setCurrentForms] = useState([]);
    const [formKey, setFormKey] = useState(0); // Force FormBuilder remount
    const [currentFormId, setCurrentFormId] = useState(null); // Track actual form ID from localStorage

    // Mutation for saving form
    const { mutate: saveForm } = useSaveFormMutation();

    // Mutation for updating form
    const { mutate: updateFormById } = useUpdateFormByIdMutation();

    // Mutation for deleting form
    const { mutate: deleteFormById } = useDeleteFormByIdMutation();

    // Fetch data
    const { data: domainsData, isLoading: isLoadingDomains } = useDomainsQuery();
    const { data: applicationsData, isLoading: isLoadingApps } = useApplicationsQuery(selectedDomain);
    const { data: menusData, isLoading: isLoadingMenus } = useMenusQuery(selectedApplication);
    const { data: formsData, isLoading: isLoadingForms, refetch: refetchForms } = useFormsByMenuQuery(selectedMenu);

    // Transform data for select options
    const domains = Array.isArray(domainsData)
        ? domainsData.map(domain => ({ value: domain.id, label: domain.name }))
        : Array.isArray(domainsData?.data)
            ? domainsData.data.map(domain => ({ value: domain.id, label: domain.name }))
            : [];

    const applications = Array.isArray(applicationsData)
        ? applicationsData.map(app => ({ value: app.id, label: app.name }))
        : Array.isArray(applicationsData?.data)
            ? applicationsData.data.map(app => ({ value: app.id, label: app.name }))
            : [];

    // Convert menus to TreeSelect format
    const convertToTreeData = (menuArray) => {
        if (!Array.isArray(menuArray)) return [];
        return menuArray.map(item => {
            const treeNode = {
                value: item.menu_id || item.id || item.key,
                title: item.label || item.name,
                key: item.menu_id || item.id || item.key,
            };
            if (item.children && item.children.length > 0) {
                treeNode.children = convertToTreeData(item.children);
            }
            return treeNode;
        });
    };

    const menuTreeData = Array.isArray(menusData)
        ? convertToTreeData(menusData)
        : Array.isArray(menusData?.data)
            ? convertToTreeData(menusData.data)
            : menusData?.mainNavigation && Array.isArray(menusData.mainNavigation)
                ? convertToTreeData(menusData.mainNavigation)
                : [];

    // Auto-select first domain
    useEffect(() => {
        if (domains.length > 0 && !selectedDomain) {
            setSelectedDomain(domains[0].value);
        }
    }, [domains, selectedDomain]);

    // Auto-select first application
    useEffect(() => {
        if (applications.length > 0 && !selectedApplication) {
            setSelectedApplication(applications[0].value);
        }
    }, [applications, selectedApplication]);

    // Handle domain change
    const handleDomainChange = useCallback((domainId) => {
        setSelectedDomain(domainId);
        setSelectedApplication(null);
        setSelectedMenu(null);
        setCurrentForms([]);
        setCurrentFormId(null);
    }, []);

    // Handle application change
    const handleApplicationChange = useCallback((applicationId) => {
        setSelectedApplication(applicationId);
        setSelectedMenu(null);
        setCurrentForms([]);
        setCurrentFormId(null);
    }, []);

    // Handle menu change
    const handleMenuChange = useCallback((menuKey) => {
        setSelectedMenu(menuKey);
        setCurrentForms([]);
        setCurrentFormId(null);
    }, []);

    // Helper function to clear localStorage and state
    const clearFormsState = useCallback(() => {
        setCurrentForms([]);
        setCurrentFormId(null);
        setFormKey(prev => prev + 1);

        // Clear localStorage
        localStorage.removeItem('zionixlc-forms-metadata');
        localStorage.removeItem('zionixlc-current-form-id');
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('zionixlc-form-schema-')) {
                localStorage.removeItem(key);
            }
        });

        // Clear FormBuilder store
        const store = useFormBuilderStore.getState();
        store.loadForm(null, null, null);

        // Notify FormsPanel
        window.dispatchEvent(new Event('zionixlc-forms-updated'));
        window.dispatchEvent(new Event('zionixlc-form-selected'));
    }, []);

    // Load forms from API into React state AND sync to localStorage for FormsPanel
    useEffect(() => {
        if (!selectedMenu) {
            clearFormsState();
            return;
        }

        if (isLoadingForms || !formsData) {
            if (!isLoadingForms && !formsData) {
                clearFormsState();
            }
            return;
        }

        try {
            // Handle both array and single object responses
            let formsResponse;
            if (Array.isArray(formsData)) {
                formsResponse = formsData[0];
            } else if (Array.isArray(formsData?.data)) {
                formsResponse = formsData.data[0];
            } else if (formsData && formsData.forms) {
                formsResponse = formsData;
            } else {
                formsResponse = null;
            }

            if (!formsResponse || !formsResponse.forms || formsResponse.forms.length === 0) {
                clearFormsState();
                baseMessage.info('No forms found for this menu.');
                return;
            }

            // Clear old form schemas from localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('zionixlc-form-schema-')) {
                    localStorage.removeItem(key);
                }
            });

            const extractedForms = formsResponse.forms;

            // Validate that all forms have form_id
            if (!extractedForms.every(form => form.form_id)) {
                console.error('[FormManagement] Some forms missing form_id:', extractedForms);
                baseMessage.error('Invalid form data: missing form_id');
                return;
            }

            // Sync to localStorage for FormsPanel
            const now = new Date().toISOString();
            const formsMetadata = extractedForms.map(form => ({
                id: form.form_id,
                name: form.name || 'Untitled Form',
                description: form.description || '',
                menuId: selectedMenu,
                createdAt: now,
                updatedAt: now,
            }));

            localStorage.setItem('zionixlc-forms-metadata', JSON.stringify(formsMetadata));

            extractedForms.forEach(form => {
                localStorage.setItem(`zionixlc-form-schema-${form.form_id}`, JSON.stringify(form));
            });

            if (formsMetadata.length > 0) {
                localStorage.setItem('zionixlc-current-form-id', formsMetadata[0].id);
                setCurrentFormId(formsMetadata[0].id);
            }

            setCurrentForms(extractedForms);
            setFormKey(prev => prev + 1);

            window.dispatchEvent(new Event('zionixlc-forms-updated'));
            window.dispatchEvent(new Event('zionixlc-form-selected'));

            baseMessage.success(`Loaded ${extractedForms.length} form(s)`);

        } catch (error) {
            console.error('[FormManagement] Error loading forms:', error);
            clearFormsState();
            baseMessage.error('Failed to load forms');
        }
    }, [selectedMenu, formsData, isLoadingForms, clearFormsState]);

    // Auto-load first form when currentFormId changes and forms are available
    useEffect(() => {
        if (currentFormId && currentForms.length > 0) {
            const store = useFormBuilderStore.getState();

            // Find the form by currentFormId
            const currentForm = currentForms.find(form => form.form_id === currentFormId);

            if (currentForm) {
                const formName = currentForm.name || 'Untitled Form';
                console.log('[FormManagement] Auto-loading form:', currentFormId, formName);
                store.loadForm(currentForm, currentFormId, formName);
            } else {
                console.warn('[FormManagement] Form not found for ID:', currentFormId);
            }
        }
    }, [currentFormId, currentForms]);

    // Listen for form creation/updates from FormsPanel
    useEffect(() => {
        const handleFormCreatedOrUpdated = async () => {
            if (!selectedMenu) return;

            const metadata = localStorage.getItem('zionixlc-forms-metadata');
            if (!metadata) return;

            const formsMetadata = JSON.parse(metadata);
            const menuForms = formsMetadata.filter(f => f.menuId === selectedMenu);

            if (menuForms.length === 0) return;

            // Load all form schemas from localStorage
            const loadedForms = [];
            for (const meta of menuForms) {
                const schemaStr = localStorage.getItem(`zionixlc-form-schema-${meta.id}`);
                if (schemaStr) {
                    const schema = JSON.parse(schemaStr);
                    loadedForms.push({
                        ...schema,
                        name: schema.name || meta.name,
                        form_id: schema.form_id || meta.id
                    });
                }
            }

            setCurrentForms(loadedForms);

            // Get current form ID and load it
            const currentId = localStorage.getItem('zionixlc-current-form-id');
            if (currentId) {
                const formToLoad = loadedForms.find(f => f.form_id === currentId);
                if (formToLoad) {
                    setCurrentFormId(currentId);
                    const store = useFormBuilderStore.getState();
                    const formName = formToLoad.name || 'Untitled Form';
                    store.loadForm(formToLoad, currentId, formName);
                }
            }
        };

        window.addEventListener('zionixlc-forms-updated', handleFormCreatedOrUpdated);
        window.addEventListener('zionixlc-form-selected', handleFormCreatedOrUpdated);

        return () => {
            window.removeEventListener('zionixlc-forms-updated', handleFormCreatedOrUpdated);
            window.removeEventListener('zionixlc-form-selected', handleFormCreatedOrUpdated);
        };
    }, [selectedMenu]);

    // Custom form creation handler for API-based form creation
    const handleCustomFormCreate = useCallback(async (formData) => {
        if (!selectedMenu) {
            throw new Error('No menu selected');
        }

        try {
            // Create form via API
            const payload = {
                menu_id: selectedMenu,
                access: "write",
                forms: [{
                    name: formData.name,
                    description: formData.description || '',
                    version: "1",
                    tooltipType: "AntTooltip",
                    errorType: "AntErrorMessage",
                    modalType: "AntModal",
                    form: {
                        key: "Screen",
                        type: "Screen",
                        props: {},
                        children: [],
                    },
                    localization: {},
                    languages: [{
                        code: "en",
                        dialect: "US",
                        name: "English",
                        description: "American English",
                        bidi: "ltr",
                    }],
                    defaultLanguage: "en-US",
                }]
            };

            return new Promise((resolve, reject) => {
                saveForm(payload, {
                    onSuccess: async () => {
                        await refetchForms();
                        resolve({ form_id: 'new-form-created' });
                    },
                    onError: (error) => {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('[FormManagement] Custom form create error:', error);
            throw error;
        }
    }, [selectedMenu, saveForm, refetchForms]);

    // Custom form update handler for API-based form update
    const handleCustomFormUpdate = useCallback(async (formId, formData) => {
        if (!selectedMenu) {
            throw new Error('No menu selected');
        }

        if (!formId) {
            throw new Error('Form ID is required');
        }

        try {
            // Get the current form from state
            const currentForm = currentForms.find(f => f.form_id === formId);
            if (!currentForm) {
                throw new Error('Form not found');
            }

            // Get the latest schema from FormBuilder store
            const store = useFormBuilderStore.getState();
            const latestFormSchema = store.formSchema;

            // Build the payload with updated name/description and latest schema
            const payload = {
                menu_id: selectedMenu,
                access: "write",
                forms: [{
                    ...latestFormSchema,
                    form_id: formId,
                    name: formData.name,
                    description: formData.description || '',
                }]
            };

            return new Promise((resolve, reject) => {
                updateFormById({ formId, payload }, {
                    onSuccess: async () => {
                        await refetchForms();
                        resolve({ form_id: formId });
                    },
                    onError: (error) => {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('[FormManagement] Custom form update error:', error);
            throw error;
        }
    }, [selectedMenu, currentForms, updateFormById, refetchForms]);

    // Custom form delete handler for API-based form deletion
    const handleCustomFormDelete = useCallback(async (formId) => {
        if (!selectedMenu) {
            throw new Error('No menu selected');
        }

        if (!formId) {
            throw new Error('Form ID is required');
        }

        try {
            return new Promise((resolve, reject) => {
                deleteFormById(formId, {
                    onSuccess: async () => {
                        await refetchForms();
                        resolve({ form_id: formId });
                    },
                    onError: (error) => {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('[FormManagement] Custom form delete error:', error);
            throw error;
        }
    }, [selectedMenu, deleteFormById, refetchForms]);

    // Get selected menu name for display
    const selectedMenuName = useMemo(() => {
        if (!selectedMenu || !menuTreeData) return '';

        const findMenuName = (nodes) => {
            for (const node of nodes) {
                if (node.value === selectedMenu) return node.title;
                if (node.children) {
                    const found = findMenuName(node.children);
                    if (found) return found;
                }
            }
            return '';
        };

        return findMenuName(menuTreeData);
    }, [selectedMenu, menuTreeData]);

    // Form create configuration
    const formCreateConfig = useMemo(() => ({
        customFields: selectedMenu ? [{
            name: 'menuName',
            label: 'Menu Name',
            value: selectedMenuName,
            disabled: true,
            placeholder: 'Menu Name'
        }] : undefined,
        onFormCreate: selectedMenu ? handleCustomFormCreate : undefined,
        onFormUpdate: selectedMenu ? handleCustomFormUpdate : undefined,
        onFormDelete: selectedMenu ? handleCustomFormDelete : undefined
    }), [selectedMenu, selectedMenuName, handleCustomFormCreate, handleCustomFormUpdate, handleCustomFormDelete]);



    // Custom validators
    const customValidators = useMemo(() => ({
        string: {
            isHex: {
                validate: value => /^[0-9A-F]*$/i.test(value)
            }
        }
    }), []);

    // Custom actions
    const customActions = useMemo(() => ({
        logEventArgs: (e) => {
            console.log('Custom action:', e);
        }
    }), []);

    // Count active filters
    const activeFiltersCount = [selectedDomain, selectedApplication, selectedMenu].filter(Boolean).length;

    // Filter popover content
    const filterContent = useMemo(() => (
        <div style={{ width: 320, padding: '8px 0' }}>
            <BaseSpace direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>
                        Domain
                    </div>
                    <BaseSelect
                        placeholder="Select Domain"
                        style={{ width: '100%' }}
                        value={selectedDomain}
                        onChange={handleDomainChange}
                        options={domains}
                        loading={isLoadingDomains}
                        allowClear
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>
                        Application
                    </div>
                    <BaseSelect
                        placeholder="Select Application"
                        style={{ width: '100%' }}
                        value={selectedApplication}
                        onChange={handleApplicationChange}
                        options={applications}
                        loading={isLoadingApps}
                        disabled={!selectedDomain}
                        allowClear
                    />
                </div>
                <div>
                    <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: token.colorTextSecondary }}>
                        Menu
                    </div>
                    <BaseTreeSelect
                        placeholder="Select Menu"
                        style={{ width: '100%' }}
                        value={selectedMenu}
                        onChange={handleMenuChange}
                        treeData={menuTreeData}
                        loading={isLoadingMenus}
                        disabled={!selectedApplication}
                        allowClear
                        showSearch
                        treeDefaultExpandAll={false}
                        treeNodeFilterProp="title"
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                    />
                </div>
            </BaseSpace>
        </div>
    ), [selectedDomain, selectedApplication, selectedMenu, domains, applications, menuTreeData,
        isLoadingDomains, isLoadingApps, isLoadingMenus, token,
        handleDomainChange, handleApplicationChange, handleMenuChange]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: isDarkMode ? '#141414' : '#f5f5f5',
            position: 'relative',
        }}>
            {/* Floating Filter Button */}
            <div style={{
                position: 'fixed',
                top: 80,
                right: 24,
                zIndex: 1000,
            }}>
                <BasePopover
                    content={filterContent}
                    title="Filters"
                    trigger="click"
                    open={filterPopoverOpen}
                    onOpenChange={setFilterPopoverOpen}
                    placement="bottomRight"
                >
                    <BaseBadge count={activeFiltersCount} offset={[-5, 5]}>
                        <BaseButton
                            type="primary"
                            icon={<i className="ri-filter-3-line" style={{ fontSize: 18 }} />}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }}
                        />
                    </BaseBadge>
                </BasePopover>
            </div>

            <FormBuilder
                key={formKey}
                view={builderView}
                getForm={null}
                formName={null}
                initialData={{}}
                validators={customValidators}
                actions={customActions}
                useLayoutSystem={false}
                menuId={selectedMenu}
                formCreateConfig={formCreateConfig}
            />
        </div>
    );
};

export default FormManagementScreen;
