import { useLayoutEffect, useState, useEffect } from 'react';
import { BaseLayout, BaseMenu, useTheme, BaseSelect, BaseSpace } from '@zionix-space/design-system';
import { useStyles } from './MenuTopBar.style';
import { useDomainsQuery, useApplicationsQuery } from '../hooks/useFormQuery';

const MenuTopBar = ({ menuData, selectedMainMenuKey, onSelectMainMenu, onApplicationChange }) => {
    const { token } = useTheme();
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const { data: domainsData, isLoading: isLoadingDomains } = useDomainsQuery();
    const { data: applicationsData, isLoading: isLoadingApps } = useApplicationsQuery(selectedDomain);

    // Detect dark mode from Ant Design theme
    const isDarkMode = token.colorBgBase === '#000000' || token.colorBgContainer === '#141414';

    const styles = useStyles(token, isDarkMode);

    // Transform domains data for select options
    const domains = Array.isArray(domainsData)
        ? domainsData.map(domain => ({
            value: domain.id,
            label: domain.name,
        }))
        : [];

    // Transform applications data for select options
    const applications = Array.isArray(applicationsData)
        ? applicationsData.map(app => ({
            value: app.id,
            label: app.name,
        }))
        : [];

    // Auto-select first domain on initial load
    useEffect(() => {
        if (domains.length > 0 && !selectedDomain) {
            setSelectedDomain(domains[0].value);
        }
    }, [domains, selectedDomain]);

    // Auto-select first application when applications load
    useEffect(() => {
        if (applications.length > 0 && !selectedApplication) {
            const firstAppId = applications[0].value;
            setSelectedApplication(firstAppId);
            if (onApplicationChange) {
                onApplicationChange(firstAppId);
            }
        }
    }, [applications, selectedApplication, onApplicationChange]);

    // Handle domain change
    const handleDomainChange = (domainId) => {
        setSelectedDomain(domainId);
        setSelectedApplication(null); // Reset application when domain changes
    };

    // Handle application change
    const handleApplicationChange = (applicationId) => {
        setSelectedApplication(applicationId);
        if (onApplicationChange) {
            onApplicationChange(applicationId);
        }
    };

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

    return (
        <BaseLayout.Header style={styles.topBarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
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
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <BaseSelect
                        placeholder="Domain"
                        style={{ width: 150 }}
                        allowClear
                        value={selectedDomain}
                        onChange={handleDomainChange}
                        options={domains}
                        loading={isLoadingDomains}
                    />
                    <BaseSelect
                        placeholder="Application"
                        style={{ width: 150 }}
                        allowClear
                        value={selectedApplication}
                        onChange={handleApplicationChange}
                        options={applications}
                        loading={isLoadingApps}
                        disabled={!selectedDomain}
                    />
                </div>
            </div>
        </BaseLayout.Header>
    );
};

export default MenuTopBar;
