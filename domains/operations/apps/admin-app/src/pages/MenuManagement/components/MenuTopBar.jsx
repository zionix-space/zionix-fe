import React, { useLayoutEffect } from 'react';
import { Layout, Button, Space, theme } from 'antd';
import { useTheme, ZionixLogo } from '@zionix/design-system';
import { useStyles } from './MenuTopBar.style';

const { Header } = Layout;
const { useToken } = theme;

const MenuTopBar = () => {
    const { token } = useToken();
    const { isDarkMode } = useTheme();
    const styles = useStyles(token, isDarkMode);

    // Inject CSS to override Ant Design Menu default styles
    useLayoutEffect(() => {
        const styleId = 'admin-topbar-override';
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
                    <ZionixLogo
                        size={48}
                        useThemeColors={true}
                        style={{ marginRight: '12px' }}
                    />
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
