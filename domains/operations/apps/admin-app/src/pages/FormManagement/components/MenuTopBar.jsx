import { useLayoutEffect } from 'react';
import { BaseLayout, BaseMenu, useTheme, BaseSelect, BaseSpace } from '@zionix-space/design-system';
import { useStyles } from './MenuTopBar.style';
import { useDomainsQuery } from '../hooks/useFormQuery';

const MenuTopBar = ({ menuData, selectedMainMenuKey, onSelectMainMenu }) => {
    const { token } = useTheme();
    const { data: domainsData, isLoading: isLoadingDomains, error } = useDomainsQuery();

    console.log('MenuTopBar - Domains Query:', { domainsData, isLoadingDomains, error });

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
        border-left: 3px solid !important;
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

    // Transform domains data for select options
    // API returns array directly, not nested under 'data'
    const domains = Array.isArray(domainsData)
        ? domainsData.map(domain => ({
            value: domain.id,  // Use 'id' not '_id'
            label: domain.name,
        }))
        : [];

    console.log('Transformed domains:', domains);

    const applications = [
        { value: 'admin-app', label: 'Admin App' },
        { value: 'user-app', label: 'User App' },
        { value: 'reporting-app', label: 'Reporting App' },
    ];

    return (
        <BaseLayout.Header style={styles.topBarStyle}>
            <BaseSpace style={{ width: '100%', justifyContent: 'space-between' }}>
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
                <BaseSpace size="small">
                    <BaseSelect
                        placeholder="Domain"
                        style={{ width: 150 }}
                        allowClear
                        options={domains}
                        loading={isLoadingDomains}
                    />
                    <BaseSelect
                        placeholder="Application"
                        style={{ width: 150 }}
                        allowClear
                        options={applications}
                    />
                </BaseSpace>
            </BaseSpace>
        </BaseLayout.Header>
    );
};

export default MenuTopBar;
