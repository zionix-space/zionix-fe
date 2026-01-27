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
    const { menuData } = useMenuData();
    const [openKeys, setOpenKeys] = useState([]);

    // Get the currently selected menu key from location
    const selectedKey = window.location.pathname.split('/').filter(Boolean)[0] || 'home';

    // Handle menu item selection
    const handleItemSelect = (item) => {
        if (item.path) {
            navigate(item.path);
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
            menuItems={menuData}
            selectedKey={selectedKey}
            onItemSelect={handleItemSelect}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
        />
    );
};

export default MobileMoreMenuAdapter;
