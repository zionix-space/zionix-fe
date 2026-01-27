import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileMoreMenu } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';

/**
 * MobileMoreMenuAdapter - Adapter component that handles business logic for MobileMoreMenu
 * Connects application state and hooks to the presentational MobileMoreMenu component
 */
const MobileMoreMenuAdapter = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { mainMenus, getMenuRoute, selectSidebarMenu } = useMenuData();
    const [openKeys, setOpenKeys] = useState([]);

    // Get the currently selected menu key from location
    const selectedKey = window.location.pathname.split('/').filter(Boolean)[1] || 'home';

    // Handle menu item selection - same logic as desktop
    const handleItemSelect = (item) => {
        // Select the menu item
        selectSidebarMenu(item.key);

        // Get the proper route using the same logic as desktop
        const route = getMenuRoute(item.key);
        if (route) {
            navigate(route);
            onClose(); // Close the menu after navigation
        } else if (item.path) {
            // Fallback to item.path if getMenuRoute doesn't return anything
            navigate(item.path);
            onClose();
        }
    };

    // Handle submenu open/close
    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    return (
        <MobileMoreMenu
            isOpen={isOpen}
            onClose={onClose}
            menuItems={mainMenus}
            selectedKey={selectedKey}
            onItemSelect={handleItemSelect}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
        />
    );
};

export default MobileMoreMenuAdapter;
