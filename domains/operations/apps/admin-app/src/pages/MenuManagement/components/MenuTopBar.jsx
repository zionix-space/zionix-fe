import { useLayoutEffect } from 'react';
import { Layout, Button, Space, theme } from 'antd';
import { useStyles } from './MenuTopBar.style';

const { Header } = Layout;
const { useToken } = theme;

const MenuTopBar = () => {
    const { token } = useToken();

    // Detect dark mode from Ant Design theme
    const isDarkMode = token.colorBgBase === '#000000' || token.colorBgContainer === '#141414';

    const styles = useStyles(token, isDarkMode);

    // Inject CSS to override Ant Design Menu default styles
    useLayoutEffect(() => {
        const styleId = 'menu-topbar-override';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      /* Remove all borders and underlines from menu items */
      .ant-menu-horizontal > .ant-menu-item::after,
      .ant-menu-horizontal > .ant-menu-item-selected::after,
      .ant-menu-horizontal > .ant-menu-item-active::after,
      .ant-menu-horizontal > .ant-menu-submenu::after {
        border-bottom: none !important;
        display: none !important;
      }
    `;
        document.head.appendChild(style);
    }, [token]);

    return (
        <Header style={styles.topBarStyle}>
            {/* Left Section - Brand */}
            <div style={styles.leftSectionStyle}>
                <div style={styles.brandContainerStyle}>
                    {/* Simple logo icon instead of ZionixLogo component */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px',
                    }}>
                        <i className="ri-menu-2-line" style={{
                            fontSize: '32px',
                            color: token.colorPrimary,
                        }} />
                    </div>
                    <span style={styles.logoTextStyle}>Menu Management</span>
                </div>
            </div>

            {/* Right Section - Actions */}
            <Space style={styles.rightActionsStyle}>
                <Button
                    type="text"
                    icon={<i className="ri-notification-3-line" />}
                    style={styles.iconButtonStyle}
                    title="Notifications"
                />
            </Space>
        </Header>
    );
};

export default MenuTopBar;
