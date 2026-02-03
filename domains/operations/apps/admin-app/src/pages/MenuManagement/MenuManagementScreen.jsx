import { useState, useCallback, useEffect } from 'react';
import { BaseLayout, BaseTypography, BaseSpace, BaseButton, BaseTooltip, BaseDrawer } from '@zionix-space/design-system';
import { useTheme } from '@zionix-space/design-system';
import MenuTopBar from './components/MenuTopBar';
import MenuSidebar from './components/MenuSidebar';
import MenuEditor from './components/MenuEditor';

const { Content } = BaseLayout;
const { Title, Paragraph } = BaseTypography;

const MenuManagementScreen = () => {
    const { token, isMobile } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [menuData, setMenuData] = useState(null);
    const [selectedMainMenuKey, setSelectedMainMenuKey] = useState('');

    // Theme-aware background
    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    // Handle menu data updates from MenuEditor
    const handleMenuDataChange = useCallback((data) => {
        setMenuData(data);
    }, []);

    // Auto-select first main menu when data loads
    useEffect(() => {
        if (!selectedMainMenuKey && menuData?.mainNavigation?.length > 0) {
            setSelectedMainMenuKey(menuData.mainNavigation[0].key);
        }
    }, [menuData, selectedMainMenuKey]);

    // Mobile: Render with drawer for sidebar
    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
                {/* Menu Management Top Bar */}
                <MenuTopBar
                    menuData={menuData}
                    selectedMainMenuKey={selectedMainMenuKey}
                    onSelectMainMenu={setSelectedMainMenuKey}
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
                    <BaseSpace orientation="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>Menu Setup</Title>
                            <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                Configure and manage your application menus.
                            </Paragraph>
                        </div>

                        {/* Menu Editor Component */}
                        <MenuEditor
                            jsonPreviewOpen={showJsonPreview}
                            onJsonPreviewClose={() => setShowJsonPreview(false)}
                            onMenuDataChange={handleMenuDataChange}
                            isMobile={isMobile}
                        />
                    </BaseSpace>
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
                        padding: '24px',
                        background: getLightPrimaryBg(),
                        overflow: 'auto',
                        height: '100%',
                    }}
                >
                    <BaseSpace orientation="vertical" size="large" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>Menu Setup</Title>
                                <Paragraph style={{ margin: '4px 0 0 0' }}>
                                    Configure and manage your application menus here.
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

                        {/* Menu Editor Component */}
                        <MenuEditor
                            jsonPreviewOpen={showJsonPreview}
                            onJsonPreviewClose={() => setShowJsonPreview(false)}
                            onMenuDataChange={handleMenuDataChange}
                            isMobile={false}
                        />
                    </BaseSpace>
                </Content>
            </BaseLayout>
        </BaseLayout>
    );
};

export default MenuManagementScreen;
