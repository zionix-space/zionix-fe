import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { BaseLayout, BaseTypography, BaseSpace, BaseButton, BaseTooltip, BaseDrawer, BaseSpin, theme } from '@zionix-space/design-system';

// Lazy load heavy components
const RoleTopBar = lazy(() => import('../components/RoleTopBar'));
const RoleSidebar = lazy(() => import('../components/RoleSidebar'));
const RoleEditor = lazy(() => import('../components/RoleEditor'));

const { Content } = BaseLayout;
const { Title, Paragraph } = BaseTypography;
const { useToken } = theme;

const ComponentLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <BaseSpin size="large" />
    </div>
);

const RoleManagementTab = ({ isMobile }) => {
    const { token } = useToken();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [menuData, setMenuData] = useState(null);
    const [selectedMainMenuKey, setSelectedMainMenuKey] = useState('');

    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    const handleMenuDataChange = useCallback((data) => {
        setMenuData(data);
    }, []);

    useEffect(() => {
        if (!selectedMainMenuKey && menuData?.mainNavigation?.length > 0) {
            setSelectedMainMenuKey(menuData.mainNavigation[0].key);
        }
    }, [menuData, selectedMainMenuKey]);

    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: 'calc(100vh - 46px)' }}>
                <Suspense fallback={<ComponentLoader />}>
                    <RoleTopBar
                        menuData={menuData}
                        selectedMainMenuKey={selectedMainMenuKey}
                        onSelectMainMenu={setSelectedMainMenuKey}
                        isMobile={isMobile}
                        onMenuClick={() => setMobileSidebarOpen(true)}
                    />
                </Suspense>

                <BaseDrawer
                    placement="left"
                    open={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                    width="80%"
                    styles={{ body: { padding: 0 } }}
                >
                    <Suspense fallback={<ComponentLoader />}>
                        <RoleSidebar
                            collapsed={false}
                            onCollapse={() => { }}
                            menuData={menuData}
                            selectedMainMenuKey={selectedMainMenuKey}
                            isMobile={isMobile}
                            onItemClick={() => setMobileSidebarOpen(false)}
                        />
                    </Suspense>
                </BaseDrawer>

                <Content
                    style={{
                        padding: '16px',
                        background: getLightPrimaryBg(),
                        overflow: 'auto',
                        height: 'calc(100vh - 98px)',
                    }}
                >
                    <BaseSpace direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>User Roles Setup</Title>
                            <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                Configure and manage your application User Menus Role Access.
                            </Paragraph>
                        </div>

                        <Suspense fallback={<ComponentLoader />}>
                            <RoleEditor
                                jsonPreviewOpen={showJsonPreview}
                                onJsonPreviewClose={() => setShowJsonPreview(false)}
                                onMenuDataChange={handleMenuDataChange}
                                isMobile={isMobile}
                            />
                        </Suspense>
                    </BaseSpace>
                </Content>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout style={{ height: '100%', minHeight: 'calc(100vh - 46px)' }}>
            <Suspense fallback={<ComponentLoader />}>
                <RoleTopBar
                    menuData={menuData}
                    selectedMainMenuKey={selectedMainMenuKey}
                    onSelectMainMenu={setSelectedMainMenuKey}
                    isMobile={false}
                />
            </Suspense>

            <BaseLayout style={{ height: 'calc(100vh - 98px)' }}>
                <Suspense fallback={<ComponentLoader />}>
                    <RoleSidebar
                        collapsed={sidebarCollapsed}
                        onCollapse={setSidebarCollapsed}
                        menuData={menuData}
                        selectedMainMenuKey={selectedMainMenuKey}
                        isMobile={false}
                    />
                </Suspense>

                <Content
                    style={{
                        padding: '24px',
                        background: getLightPrimaryBg(),
                        overflow: 'auto',
                        height: '100%',
                    }}
                >
                    <BaseSpace direction="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Title level={3} style={{ margin: 0 }}>User Roles Setup</Title>
                                <Paragraph style={{ margin: '4px 0 0 0' }}>
                                    Configure and manage your application User Menus Role Access.
                                </Paragraph>
                            </div>

                            <BaseTooltip title="Preview JSON">
                                <BaseButton
                                    type="text"
                                    icon={<i className="ri-code-s-slash-line" style={{ fontSize: '20px' }} />}
                                    onClick={() => setShowJsonPreview(true)}
                                    shape="circle"
                                    size="large"
                                />
                            </BaseTooltip>
                        </div>

                        <Suspense fallback={<ComponentLoader />}>
                            <RoleEditor
                                jsonPreviewOpen={showJsonPreview}
                                onJsonPreviewClose={() => setShowJsonPreview(false)}
                                onMenuDataChange={handleMenuDataChange}
                                isMobile={false}
                            />
                        </Suspense>
                    </BaseSpace>
                </Content>
            </BaseLayout>
        </BaseLayout>
    );
};

export default RoleManagementTab;
