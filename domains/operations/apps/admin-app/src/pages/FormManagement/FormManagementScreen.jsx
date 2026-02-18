import { useState, useCallback, useEffect } from 'react';
import { BaseLayout, BaseTypography, BaseDrawer } from '@zionix-space/design-system';
import { useTheme } from '@zionix-space/design-system';
import MenuTopBar from './components/MenuTopBar';
import MenuSidebar from './components/MenuSidebar';
import { useMenusQuery } from './hooks/useFormQuery';
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
const { Content } = BaseLayout;
const { Title, Paragraph } = BaseTypography;
// Create BuilderView with all Ant Design components
// Matches zionixlc's pattern exactly: rSuiteComponents.map(c => c.build())
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

// Get form by ID from IndexedDB
const getForm = async (formId) => {
    if (!formId) return null;
    const schema = await formDB.getFormSchema(formId);
    return schema ? JSON.stringify(schema) : null;
};

/**
 * FormBuilder page
 * Fully dynamic - loads form based on user selection
 */

const MenuManagementScreen = () => {
    const { token, isMobile } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [selectedMainMenuKey, setSelectedMainMenuKey] = useState('');
    const [currentFormId, setCurrentFormId] = useState(() => getCurrentFormId());
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Fetch menus based on selected application
    const { data: menusData } = useMenusQuery(selectedApplication);

    // Transform menus data to match expected format
    const menuData = menusData ? { mainNavigation: menusData } : null;

    // Listen for form selection changes
    useEffect(() => {
        const handleStorageChange = () => {
            const newFormId = getCurrentFormId();
            setCurrentFormId(newFormId);
        };

        // Listen for custom event when form is selected
        window.addEventListener('zionixlc-form-selected', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('zionixlc-form-selected', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Custom validators (optional)
    const customValidators = {
        string: {
            isHex: {
                validate: value => /^[0-9A-F]*$/i.test(value)
            }
        }
    };

    // Custom actions (optional)
    const customActions = {
        logEventArgs: (e) => {
            console.log('Custom action - logEventArgs:', e);
        }
    };

    // Form data change handler (optional)
    const handleFormDataChange = ({ data, errors }) => {
        console.log('Form data changed:', { data, errors });
    };

    // Always show FormBuilder - it handles empty state internally
    // Theme-aware background
    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    // Auto-select first main menu when data loads
    useEffect(() => {
        if (!selectedMainMenuKey && menuData?.mainNavigation?.length > 0) {
            setSelectedMainMenuKey(menuData.mainNavigation[0].key);
        }
    }, [menuData, selectedMainMenuKey]);

    // Handle application selection from MenuTopBar
    const handleApplicationChange = useCallback((applicationId) => {
        setSelectedApplication(applicationId);
    }, []);

    // Mobile: Render with drawer for sidebar
    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
                {/* Menu Management Top Bar */}
                <MenuTopBar
                    menuData={menuData}
                    selectedMainMenuKey={selectedMainMenuKey}
                    onSelectMainMenu={setSelectedMainMenuKey}
                    onApplicationChange={handleApplicationChange}
                    isMobile={isMobile}
                    onMenuClick={() => setMobileSidebarOpen(true)}
                />

                {/* Mobile Sidebar Drawer */}
                <BaseDrawer
                    placement="left"
                    open={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                    width="80%"
                    styles={{ body: { padding: 0 } }}
                >
                    <MenuSidebar
                        collapsed={false}
                        onCollapse={() => { }}
                        menuData={menuData}
                        selectedMainMenuKey={selectedMainMenuKey}
                        isMobile={isMobile}
                        onItemClick={() => setMobileSidebarOpen(false)}
                    />
                </BaseDrawer>

                {/* Menu Management Content */}
                <Content
                    style={{
                        padding: '16px',
                        background: getLightPrimaryBg(),
                        overflow: 'auto',
                        height: 'calc(100vh - 52px)',
                    }}
                >
                    <FormBuilder
                        key={currentFormId || 'no-form'} // Force remount when form changes
                        view={builderView}
                        getForm={currentFormId ? () => getForm(currentFormId) : null}
                        formName={currentFormId || null}
                        initialData={{}}
                        validators={customValidators}
                        actions={customActions}
                        onFormDataChange={handleFormDataChange}
                        useLayoutSystem={false}  // Disable layout system - use hardcoded version
                    />
                </Content>
            </BaseLayout>
        );
    }

    // Desktop: Render with fixed sidebar
    return (
        <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
            {/* Menu Management Top Bar */}
            <MenuTopBar
                menuData={menuData}
                selectedMainMenuKey={selectedMainMenuKey}
                onSelectMainMenu={setSelectedMainMenuKey}
                onApplicationChange={handleApplicationChange}
                isMobile={false}
            />

            {/* Layout Container */}
            <BaseLayout style={{ height: 'calc(100vh - 52px)' }}>
                {/* Menu Management Sidebar */}
                <MenuSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    menuData={menuData}
                    selectedMainMenuKey={selectedMainMenuKey}
                    isMobile={false}
                />

                {/* Menu Management Content */}
                <Content
                    style={{
                        background: getLightPrimaryBg(),
                        overflow: 'scroll',
                        height: '100%',
                        scrollBehavior: "smooth"
                    }}
                >
                    <FormBuilder
                        key={currentFormId || 'no-form'} // Force remount when form changes
                        view={builderView}
                        getForm={currentFormId ? () => getForm(currentFormId) : null}
                        formName={currentFormId || null}
                        initialData={{}}
                        validators={customValidators}
                        actions={customActions}
                        onFormDataChange={handleFormDataChange}
                        useLayoutSystem={false}  // Disable layout system - use hardcoded version
                    />
                </Content>
            </BaseLayout>
        </BaseLayout>
    );
};

export default MenuManagementScreen;
