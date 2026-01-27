import { useLayoutEffect } from 'react';
import { BaseLayout, BaseButton, BaseSpace, BaseMenu, theme } from '@zionix-space/design-system';
import { useStyles } from './RoleTopBar.style';

const { Header } = BaseLayout;
const { useToken } = theme;

const RoleTopBar = ({ menuData, selectedMainMenuKey, onSelectMainMenu }) => {
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
      
      /* Menu item styling */
      .menu-topbar-menu .ant-menu-item {
        border-radius: 8px !important;
        padding: 0 16px !important;
        height: 28px !important;
        line-height: 28px !important;
        margin: 0 2px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: ${token.colorText} !important;
        opacity: 0.7 !important;
        transition: all 0.2s ease !important;
      }
      
      .menu-topbar-menu .ant-menu-item:hover {
        background: ${token.colorFillQuaternary} !important;
        opacity: 1 !important;
      }
      
      .menu-topbar-menu .ant-menu-item-selected {
        background: ${token.colorPrimaryBg} !important;
        color: ${token.colorPrimary} !important;
        opacity: 1 !important;
        font-weight: 600 !important;
      }
    `;
        document.head.appendChild(style);
    }, [token]);

    // Get main navigation items (root level)
    const mainMenuItems = menuData?.mainNavigation?.map(item => ({
        key: item.key,
        label: item.label,
        icon: item.icon ? <i className={item.icon} /> : null,
    })) || [];

    return (
        <Header style={styles.topBarStyle}>
            {/* Left Section - Brand (Absolute positioned) */}
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
                <span style={styles.logoTextStyle}>User Role Management</span>
            </div>

            {/* Center - Navigation Menu */}
            {mainMenuItems.length > 0 && (
                <div style={styles.navigationContainerStyle}>
                    <BaseMenu
                        mode="horizontal"
                        selectedKeys={selectedMainMenuKey ? [selectedMainMenuKey] : []}
                        items={mainMenuItems}
                        onClick={({ key }) => onSelectMainMenu && onSelectMainMenu(key)}
                        style={styles.menuStyle}
                        className="menu-topbar-menu"
                    />
                </div>
            )}

            {/* Right Section - Actions (Absolute positioned) */}
            <BaseSpace style={styles.rightActionsStyle}>
                <BaseButton
                    type="text"
                    icon={<i className="ri-notification-3-line" />}
                    style={styles.iconButtonStyle}
                    title="Notifications"
                />
            </BaseSpace>
        </Header>
    );
};

export default RoleTopBar;
