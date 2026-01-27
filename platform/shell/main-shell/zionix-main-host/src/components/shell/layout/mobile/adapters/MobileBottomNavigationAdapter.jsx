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
        getMenuRoute,
        selectSidebarMenu,
    } = useMenuData();

    // Handle navigation item click - same logic as desktop
    const handleNavItemClick = (navItem) => {
        if (navItem.isMore) {
            // Open More menu
            setIsMoreMenuOpen(true);
        } else {
            // Set selected nav item
            setSelectedNavKey(navItem.key);

            // Use the same routing logic as desktop
            if (navItem.key === 'home') {
                navigate('/apps');
            } else {
                // Select the menu item
                selectSidebarMenu(navItem.key);

                // Get the proper route using the same logic as desktop
                const route = getMenuRoute(navItem.key);
                if (route) {
                    navigate(route);
                } else if (navItem.path) {
                    // Fallback to navItem.path
                    navigate(navItem.path);
                }
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
