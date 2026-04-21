import { useState, useCallback, useEffect } from 'react';
import { BaseLayout, BaseTypography, BaseSpace, BaseDrawer } from '@zionix-space/design-system';
import { useTheme } from '@zionix-space/design-system';
import MenuEditor from './components/MenuEditor';

const { Content } = BaseLayout;
const { Title, Paragraph } = BaseTypography;

const MenuManagementScreen = () => {
    const { token, isMobile } = useTheme();
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [menuData, setMenuData] = useState(null);

    // Handle menu data updates from MenuEditor
    const handleMenuDataChange = useCallback((data) => {
        setMenuData(data);
    }, []);

    // Mobile: Render with drawer for sidebar
    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
                {/* Menu Management Content */}
                <Content
                    style={{
                        padding: '16px',
                        overflow: 'auto',
                        height: '100vh',
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

    // Desktop: Render without custom sidebar/topbar (host app provides them)
    return (
        <Content
            style={{
                padding: '24px',
                overflow: 'auto',
                minHeight: '100vh',
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
    );
};

export default MenuManagementScreen;
