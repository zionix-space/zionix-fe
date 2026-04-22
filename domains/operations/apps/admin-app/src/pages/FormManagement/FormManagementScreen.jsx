import { useState, useEffect, useMemo, useCallback } from 'react';
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
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [formKey, setFormKey] = useState(0); // Force FormBuilder remount

    // Generate a stable form ID for FormBuilder
    const currentFormId = useMemo(() => {
        if (!selectedMenu || currentForms.length === 0) return null;
        return `form-${selectedMenu}-${currentFormIndex}`;
    }, [selectedMenu, currentFormIndex, currentForms.length]);

    // Get current form schema from FormBuilder's Zustand store
    const formSchema = useFormBuilderStore(state => state.formSchema);

    // Sync FormBuilder changes back to our React state
    useEffect(() => {
        if (formSchema && currentForms.length > 0) {
            setCurrentForms(prev => {
                const updated = [...prev];
                updated[currentFormIndex] = formSchema;
                return updated;
            });
        }
    }, [formSchema, currentFormIndex]);

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
    }, []);

    // Handle application change
    const handleApplicationChange = useCallback((applicationId) => {
        setSelectedApplication(applicationId);
        setSelectedMenu(null);
        setCurrentForms([]);
    }, []);

    // Handle menu change
    const handleMenuChange = useCallback((menuKey) => {
        setSelectedMenu(menuKey);
        setCurrentForms([]);
        setCurrentFormIndex(0);
    }, []);

    // Load forms from API into React state
    useEffect(() => {
        if (!selectedMenu || isLoadingForms || !formsData) {
            return;
        }

        try {
            const forms = Array.isArray(formsData)
                ? formsData
                : Array.isArray(formsData?.data)
                    ? formsData.data
                    : [];

            if (forms.length === 0 || !forms[0]?.forms || forms[0].forms.length === 0) {
                // Initialize with empty form
                setCurrentForms([{
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
                    name: "New Form"
                }]);
                setCurrentFormIndex(0);
                setFormKey(prev => prev + 1);
                baseMessage.info('No forms found. Create a new form.');
                return;
            }

            // Extract forms from API and store in React state
            const extractedForms = forms[0].forms.map((formSchema, index) => ({
                ...formSchema,
                name: formSchema.name || formSchema.form?.name || `Form ${index + 1}`
            }));

            setCurrentForms(extractedForms);
            setCurrentFormIndex(0);
            setFormKey(prev => prev + 1);
            baseMessage.success(`Loaded ${extractedForms.length} form(s)`);

        } catch (error) {
            console.error('[FormManagement] Error loading forms:', error);
            baseMessage.error('Failed to load forms');
        }
    }, [selectedMenu, formsData, isLoadingForms]);

    // Provide form to FormBuilder from React state
    const getForm = useCallback(async () => {
        if (currentForms.length === 0 || !currentFormId) return null;
        const form = currentForms[currentFormIndex];
        return form ? JSON.stringify(form) : null;
    }, [currentForms, currentFormIndex, currentFormId]);

    // Save all forms to API
    const handleSaveForm = useCallback(async () => {
        if (!selectedMenu) {
            baseMessage.error('Please select a menu first');
            return;
        }

        if (currentForms.length === 0) {
            baseMessage.error('No forms to save');
            return;
        }

        try {
            const payload = {
                menu_id: selectedMenu,
                name: 'Form Collections',
                access: "read",
                forms: currentForms
            };

            saveForm(payload, {
                onSuccess: () => {
                    setFilterPopoverOpen(false);
                    baseMessage.success(`Saved ${currentForms.length} form(s) successfully`);
                },
                onError: (error) => {
                    baseMessage.error(error.message || 'Failed to save forms');
                }
            });

        } catch (error) {
            console.error('[FormManagement] Save error:', error);
            baseMessage.error('Failed to save forms');
        }
    }, [selectedMenu, currentForms, saveForm]);

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
        isLoadingDomains, isLoadingApps, isLoadingMenus, isSaving, token,
        handleDomainChange, handleApplicationChange, handleMenuChange, handleSaveForm]);

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
                getForm={currentFormId ? getForm : null}
                formName={currentFormId}
                initialData={{}}
                validators={customValidators}
                actions={customActions}
                useLayoutSystem={false}
                menuId={selectedMenu}
            />
        </div>
    );
};

export default FormManagementScreen;
