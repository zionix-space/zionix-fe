import { useState, useCallback, lazy, Suspense } from 'react';
import { BaseLayout, BaseTypography, BaseSpace, BaseButton, BaseTooltip, BaseSpin, theme } from '@zionix-space/design-system';

// Lazy load heavy components
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
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [menuData, setMenuData] = useState(null);

    const getLightPrimaryBg = () => {
        return `color-mix(in srgb, ${token.colorPrimaryBg} 30%, ${token.colorBgContainer})`;
    };

    const handleMenuDataChange = useCallback((data) => {
        setMenuData(data);
    }, []);

    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
                <Content
                    style={{
                        padding: '16px',
                        overflow: 'auto',
                        height: '100vh',
                    }}
                >
                    <BaseSpace orientation="vertical" size="middle" style={{ width: '100%' }}>
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
                        <Title level={2} style={{ margin: 0 }}>User Roles Setup</Title>
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
    );
};

export default RoleManagementTab;
