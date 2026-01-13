import { useState } from 'react';
import { Layout, Typography, Space, theme, Button, Tooltip } from 'antd';
import MenuTopBar from './components/MenuTopBar';
import MenuSidebar from './components/MenuSidebar';
import MenuEditor from './components/MenuEditor';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { useToken } = theme;

const MenuManagementScreen = () => {
    const { token } = useToken();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showJsonPreview, setShowJsonPreview] = useState(false);

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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>Menu Setup</Title>
                                <Paragraph style={{ margin: '4px 0 0 0' }}>
                                    Configure and manage your application menus here.
                                </Paragraph>
                            </div>
                            <Tooltip title="Preview JSON">
                                <Button
                                    type="text"
                                    icon={<i className="ri-code-s-slash-line" style={{ fontSize: '20px' }} />}
                                    onClick={() => setShowJsonPreview(true)}
                                    shape="circle"
                                    size="large"
                                />
                            </Tooltip>
                        </div>

                        {/* Menu Editor Component */}
                        <MenuEditor
                            jsonPreviewOpen={showJsonPreview}
                            onJsonPreviewClose={() => setShowJsonPreview(false)}
                        />
                    </Space>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MenuManagementScreen;
