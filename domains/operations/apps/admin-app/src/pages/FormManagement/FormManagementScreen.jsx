import { useState, useEffect, useMemo } from 'react';
import { BaseSelect, BaseSpace, BaseTreeSelect, BasePopover, BaseButton, BaseBadge, baseMessage, useTheme } from '@zionix-space/design-system';
import { useDomainsQuery, useApplicationsQuery, useMenusQuery, useSaveFormMutation, useFormsByMenuQuery } from './hooks/useFormQuery';
import {
    FormBuilder,
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

// Create BuilderView with all Ant Design components
const builderComponents = antdComponents.map(c => c.build());
const builderView = new BuilderView(builderComponents)
    .withViewerWrapper(AntLocalizationWrapper)
    .withCssLoader(BiDi.LTR, ltrCssLoader)
    .withCssLoader(BiDi.RTL, rtlCssLoader)
    .withCssLoader('common', zionixlcAntdCssLoader);

// Get the currently active form ID
const getCurrentFormId = () => {
    return localStorage.getItem('zionixlc-current-form-id') || null;
};

/**
 * Form Management Screen
 * Manages forms per menu - each menu can have multiple forms
 */
const FormManagementScreen = () => {
    const { token, isDarkMode } = useTheme();
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [currentFormId, setCurrentFormId] = useState(() => getCurrentFormId());
    const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

    // Memoize getForm function to prevent FormBuilder remount
    const getForm = useMemo(() => {
        return async (formId) => {
            if (!formId) return null;
            const schema = await formDB.getFormSchema(formId);
            return schema ? JSON.stringify(schema) : null;
        };
    }, []);

    // Mutation for saving form
    const { mutate: saveForm, isLoading: isSaving } = useSaveFormMutation();

    // Fetch data
    const { data: domainsData, isLoading: isLoadingDomains } = useDomainsQuery();
    const { data: applicationsData, isLoading: isLoadingApps } = useApplicationsQuery(selectedDomain);
    const { data: menusData, isLoading: isLoadingMenus } = useMenusQuery(selectedApplication);
    const { data: formsData, isLoading: isLoadingForms } = useFormsByMenuQuery(selectedMenu);

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

    // Convert menus to TreeSelect format (nested structure)
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

    // Auto-select first domain on initial load
    useEffect(() => {
        if (domains.length > 0 && !selectedDomain) {
            setSelectedDomain(domains[0].value);
        }
    }, [domains, selectedDomain]);

    // Auto-select first application when applications load
    useEffect(() => {
        if (applications.length > 0 && !selectedApplication) {
            setSelectedApplication(applications[0].value);
        }
    }, [applications, selectedApplication]);

    // Handle domain change
    const handleDomainChange = useMemo(() => (domainId) => {
        setSelectedDomain(domainId);
        setSelectedApplication(null);
        setSelectedMenu(null);
    }, []);

    // Handle application change
    const handleApplicationChange = useMemo(() => (applicationId) => {
        setSelectedApplication(applicationId);
        setSelectedMenu(null);
    }, []);

    // Handle menu change
    const handleMenuChange = useMemo(() => (menuKey) => {
        console.log('[FormManagement] Menu selected:', menuKey);
        setSelectedMenu(menuKey);
        // Save to localStorage so FormsPanel can access it
        if (menuKey) {
            localStorage.setItem('zionixlc-selected-menu-id', menuKey);
        } else {
            localStorage.removeItem('zionixlc-selected-menu-id');
        }
    }, []);

    // Auto-load forms from API when menu is selected
    useEffect(() => {
        const loadFormsFromAPI = async () => {
            if (!selectedMenu) {
                console.log('[FormManagement] No menu selected');
                return;
            }

            if (isLoadingForms) {
                console.log('[FormManagement] Still loading forms...');
                return;
            }

            console.log('[FormManagement] Processing forms data for menu:', selectedMenu);
            console.log('[FormManagement] formsData:', formsData);

            if (!formsData) {
                console.log('[FormManagement] No formsData yet');
                return;
            }

            try {
                const forms = Array.isArray(formsData)
                    ? formsData
                    : Array.isArray(formsData?.data)
                        ? formsData.data
                        : [];

                console.log('[FormManagement] Parsed forms array:', forms);

                if (forms.length === 0) {
                    console.log('[FormManagement] No forms found - user can create new ones');
                    // Clear any existing forms for this menu from IndexedDB
                    const allForms = await formDB.getAllForms();
                    const menuForms = allForms.filter(f => f.menuId === selectedMenu);
                    for (const form of menuForms) {
                        await formDB.deleteForm(form.id);
                    }
                    // Clear canvas
                    localStorage.removeItem('zionixlc-current-form-id');
                    setCurrentFormId(null);
                    window.dispatchEvent(new Event('zionixlc-form-selected'));
                    return;
                }

                console.log(`[FormManagement] Loading ${forms.length} form(s) for menu`);

                // Clear existing forms for this menu first
                const allForms = await formDB.getAllForms();
                const existingMenuForms = allForms.filter(f => f.menuId === selectedMenu);
                for (const form of existingMenuForms) {
                    await formDB.deleteForm(form.id);
                }

                // Load ALL forms into IndexedDB
                let loadedCount = 0;
                for (let i = 0; i < forms.length; i++) {
                    const formData = forms[i];

                    if (!formData.forms || !Array.isArray(formData.forms)) continue;

                    for (let j = 0; j < formData.forms.length; j++) {
                        const formSchema = formData.forms[j];
                        const formId = `menu-${selectedMenu}-${i}-${j}`;

                        // Save to IndexedDB
                        await formDB.saveFormSchema(formId, formSchema);
                        await formDB.saveFormMeta(formId, {
                            id: formId,
                            name: `${formData.name || 'Form'} (${i + 1}-${j + 1})`,
                            menuId: selectedMenu,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                        loadedCount++;
                    }
                }

                // Set first form as active
                const firstFormId = `menu-${selectedMenu}-0-0`;
                const firstExists = await formDB.getFormSchema(firstFormId);

                if (firstExists) {
                    localStorage.setItem('zionixlc-current-form-id', firstFormId);
                    setCurrentFormId(firstFormId);
                    window.dispatchEvent(new Event('zionixlc-form-selected'));
                    if (loadedCount > 0) {
                        baseMessage.success(`Loaded ${loadedCount} form(s)`);
                    }
                } else {
                    console.log('[FormManagement] No forms loaded, clearing canvas');
                    localStorage.removeItem('zionixlc-current-form-id');
                    setCurrentFormId(null);
                }

            } catch (error) {
                console.error('[FormManagement] Error loading forms:', error);
                baseMessage.error('Failed to load forms');
            }
        };

        loadFormsFromAPI();
    }, [selectedMenu, formsData, isLoadingForms]);

    // Handle save ALL forms for current menu to backend
    const handleSaveForm = useMemo(() => async () => {
        if (!selectedMenu) {
            baseMessage.error('Please select a menu first');
            return;
        }

        try {
            // Get ALL forms from IndexedDB that belong to this menu
            const allForms = await formDB.getAllForms();
            const menuForms = allForms.filter(f => f.menuId === selectedMenu);

            if (menuForms.length === 0) {
                baseMessage.error('No forms to save for this menu');
                return;
            }

            // Collect all form schemas
            const formSchemas = [];
            for (const formMeta of menuForms) {
                const schema = await formDB.getFormSchema(formMeta.id);
                if (schema) {
                    formSchemas.push({
                        defaultLanguage: "en-US",
                        form: schema.form,
                        languages: schema.languages || [
                            {
                                bidi: "ltr",
                                code: "en",
                                description: "American English",
                                dialect: "US",
                                name: "English"
                            }
                        ],
                        localization: schema.localization || {},
                        modalType: schema.modalType || "AntModalAdapter",
                        tooltipType: schema.tooltipType || "AntTooltip",
                        errorType: schema.errorType || "AntErrorMessage",
                        triggerWhen: schema.triggerWhen || {},
                        version: schema.version || "1"
                    });
                }
            }

            // Build request payload with ALL forms
            const payload = {
                menu_id: selectedMenu,
                name: menuForms[0].name || 'Menu Forms',
                access: ["read", "write"],
                forms: formSchemas
            };

            console.log('[FormManagement] Saving forms:', payload);

            // Save to backend
            saveForm(payload, {
                onSuccess: () => {
                    setFilterPopoverOpen(false);
                    baseMessage.success(`Saved ${formSchemas.length} form(s) successfully`);
                },
            });

        } catch (error) {
            console.error('[FormManagement] Save error:', error);
            baseMessage.error(error.message || 'Failed to save forms');
        }
    }, [selectedMenu, saveForm]);

    // Listen for form selection changes
    useEffect(() => {
        const handleStorageChange = () => {
            const newFormId = getCurrentFormId();
            setCurrentFormId(newFormId);
        };

        window.addEventListener('zionixlc-form-selected', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('zionixlc-form-selected', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
            console.log('Custom action - logEventArgs:', e);
        }
    }), []);

    // Form data change handler
    const handleFormDataChange = useMemo(() => ({ data, errors }) => {
        console.log('Form data changed:', { data, errors });
    }, []);

    // Count active filters
    const activeFiltersCount = [selectedDomain, selectedApplication, selectedMenu].filter(Boolean).length;

    // Filter popover content
    const filterContent = useMemo(() => (
        <div style={{ width: 320, padding: '8px 0' }}>
            <BaseSpace direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                    <div style={{
                        marginBottom: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: token.colorTextSecondary
                    }}>
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
                    <div style={{
                        marginBottom: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: token.colorTextSecondary
                    }}>
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
                    <div style={{
                        marginBottom: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: token.colorTextSecondary
                    }}>
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
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${token.colorBorder}` }}>
                    <BaseButton
                        type="primary"
                        block
                        size="large"
                        loading={isSaving}
                        disabled={!selectedMenu}
                        onClick={handleSaveForm}
                    >
                        Save All Forms
                    </BaseButton>
                </div>
            </BaseSpace>
        </div>
    ), [selectedDomain, selectedApplication, selectedMenu, domains, applications, menuTreeData,
        isLoadingDomains, isLoadingApps, isLoadingMenus, isSaving, token.colorTextSecondary,
        token.colorBorder, handleDomainChange, handleApplicationChange, handleMenuChange, handleSaveForm]);

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
                key={currentFormId || 'no-form'}
                view={builderView}
                getForm={currentFormId ? getForm : null}
                formName={currentFormId || null}
                initialData={{}}
                validators={customValidators}
                actions={customActions}
                onFormDataChange={handleFormDataChange}
                useLayoutSystem={false}
                menuId={selectedMenu}
            />

        </div>
    );
};

export default FormManagementScreen;
