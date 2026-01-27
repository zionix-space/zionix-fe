import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix-space/design-system';
import { MobileBottomNavigation } from '@zionix-space/design-system/layouts';
import { useMenuData } from '../../../../../data/hooks/menu';
import MobileMoreMenuAdapter from './MobileMoreMenuAdapter';

/**
 * MobileBottomNavigationAdapter - Adapter component that handles business logic for MobileBottomNavigation
 * Connects application state and hooks to the presentational MobileBottomNavigation component
 */
const MobileBottomNavigationAdapter = ({ className, style }) => {
    const { token } = useTheme();
    const navigate = useNavigate();
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [selectedNavKey, setSelectedNavKey] = useState('home');

    const {
        mainMenus,
        selectedSidebarKey,
        setSelectedSidebarKey,
        selectMainMenu,
    } = useMenuData();

    // Handle navigation item click
    const handleNavItemClick = (navItem) => {
        if (navItem.isMore) {
            // Open More menu
            setIsMoreMenuOpen(true);
        } else {
            // Set selected nav item
            setSelectedNavKey(navItem.key);

            // Navigate if path exists
            if (navItem.path) {
                navigate(navItem.path);
            }
        }
    };

    // Render More Menu
    const moreMenu = (
        <MobileMoreMenuAdapter
            isOpen={isMoreMenuOpen}
            onClose={() => setIsMoreMenuOpen(false)}
        />
    );

    return (
        <MobileBottomNavigation
            className={className}
            style={style}
            theme={{ token }}
            selectedNavKey={selectedNavKey}
            onNavItemClick={handleNavItemClick}
            moreMenu={moreMenu}
        />
    );
};

export default MobileBottomNavigationAdapter;
