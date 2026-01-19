import { useState, lazy, Suspense } from 'react';
import { Tabs, Spin } from 'antd';
import { useTheme } from '@zionix/design-system';

// Lazy load tabs for better performance
const RoleManagementTab = lazy(() => import('./tabs/RoleManagementTab'));
const FormManagementTab = lazy(() => import('./tabs/FormManagementTab'));
const ButtonManagementTab = lazy(() => import('./tabs/ButtonManagementTab'));

// Loading fallback component
const TabLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 100px)'
    }}>
        <Spin size="large" tip="Loading..." />
    </div>
);

const RoleManagementScreen = () => {
    const { isMobile } = useTheme();
    const [activeTab, setActiveTab] = useState('1');

    const tabItems = [
        {
            key: '1',
            label: 'Role Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <RoleManagementTab isMobile={isMobile} />
                </Suspense>
            ),
        },
        {
            key: '2',
            label: 'Form Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <FormManagementTab />
                </Suspense>
            ),
        },
        {
            key: '3',
            label: 'Button Management',
            children: (
                <Suspense fallback={<TabLoader />}>
                    <ButtonManagementTab />
                </Suspense>
            ),
        },
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                tabBarStyle={{ margin: 0, padding: '0 16px' }}
                destroyInactiveTabPane={true}
            />
        </div>
    );
};

export default RoleManagementScreen;
