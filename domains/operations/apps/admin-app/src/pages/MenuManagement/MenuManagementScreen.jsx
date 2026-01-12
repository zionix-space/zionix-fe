import { useState } from 'react';
import { Layout, Card, Typography, Space, theme } from 'antd';
import MenuTopBar from './components/MenuTopBar';
import MenuSidebar from './components/MenuSidebar';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { useToken } = theme;

const MenuManagementScreen = () => {
    const { token } = useToken();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <Layout style={{ height: '100%', minHeight: '100vh' }}>
            {/* Menu Management Top Bar */}
            <MenuTopBar />

            {/* Layout Container */}
            <Layout style={{ height: 'calc(100vh - 52px)' }}>
                {/* Menu Management Sidebar */}
                <MenuSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                />

                {/* Menu Management Content */}
                <Content
                    style={{
                        padding: '24px',
                        backgroundColor: token?.colorBgContainer,
                        overflow: 'auto',
                        height: '100%',
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <div>
                            <Title level={2}>Menu Setup</Title>
                            <Paragraph>
                                Configure and manage your application menus here.
                            </Paragraph>
                        </div>

                        <Card>
                            <Title level={4}>Menu Configuration</Title>
                            <Paragraph>
                                This is the menu setup screen with its own topbar and sidebar layout.
                                The main shell sidebar remains visible on the left, and this menu management panel
                                renders as content in the main area.
                            </Paragraph>
                        </Card>
                    </Space>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MenuManagementScreen;
