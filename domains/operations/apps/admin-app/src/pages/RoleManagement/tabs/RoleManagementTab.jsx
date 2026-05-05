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

const RoleManagementTab = ({ isMobile, selectedRole }) => {
    const { token } = useToken();
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [menuData, setMenuData] = useState(null);

    const handleMenuDataChange = useCallback((data) => {
        setMenuData(data);
    }, []);

    if (isMobile) {
        return (
            <BaseLayout style={{ height: '100%', minHeight: '100vh' }}>
                <Content
                    style={{
                        padding: 0,
                        overflow: 'auto',
                        height: '100vh',
                    }}
                >
                    <Suspense fallback={<ComponentLoader />}>
                        <RoleEditor
                            jsonPreviewOpen={showJsonPreview}
                            onJsonPreviewClose={() => setShowJsonPreview(false)}
                            onMenuDataChange={handleMenuDataChange}
                            isMobile={isMobile}
                        />
                    </Suspense>
                </Content>
            </BaseLayout>
        );
    }

    return (
        <Content
            style={{
                padding: 0,
                overflow: 'auto',
                minHeight: '100vh',
            }}
        >
            <div style={{ position: 'absolute', top: '16px', right: '24px', zIndex: 10 }}>
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
        </Content>
    );
};

export default RoleManagementTab;
