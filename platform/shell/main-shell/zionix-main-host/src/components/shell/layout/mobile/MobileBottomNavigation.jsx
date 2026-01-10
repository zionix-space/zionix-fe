import React, { useState } from 'react';
import { Badge, theme } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@zionix/design-system';
import { useMenuData } from '../../../../data/hooks/menu';
import { useStyles, navItemVariants } from './MobileBottomNavigation.style';
import MobileMoreMenu from './MobileMoreMenu';

const { useToken } = theme;

/**
 * Mobile Bottom Navigation Component - Native iOS-style bottom tab bar
 * Fixed navigation with Home, Message, Settings, and More
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class
 * @param {Object} [props.style={}] - Additional inline styles
 */
const MobileBottomNavigation = ({ className = '', style = {} }) => {
    const { token } = useToken();
    const styles = useStyles(token);
    const navigate = useNavigate();
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedNavKey, setSelectedNavKey] = useState('home');

    // Get menu data from the unified hook
    const {
        mainMenus,
        selectedSidebarKey,
        setSelectedSidebarKey,
        selectMainMenu,
    } = useMenuData();

    // Static bottom navigation items - Fixed 4 items
    const staticNavItems = [
        {
            key: 'home',
            label: 'Home',
            icon: 'ri-home-5-fill',
            iconOutline: 'ri-home-5-line',
            path: '/',
        },
        {
            key: 'message',
            label: 'Message',
            icon: 'ri-message-3-fill',
            iconOutline: 'ri-message-3-line',
            path: '/messages',
            badge: null, // Can be dynamically set
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: 'ri-settings-3-fill',
            iconOutline: 'ri-settings-3-line',
            path: '/settings',
        },
        {
            key: 'more',
            label: 'More',
            icon: 'ri-more-fill',
            iconOutline: 'ri-more-line',
            isMore: true,
        },
    ];

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

    // Handle More menu item selection
    const handleMoreMenuItemSelect = (item) => {
        console.log('More menu item selected:', item);

        // Check if it's a main menu item
        const isMainMenuItem = mainMenus.some(menu => menu.key === item.key);

        if (isMainMenuItem) {
            selectMainMenu(item.key);
        } else {
            // It's a sidebar menu item
            setSelectedSidebarKey(item.key);
        }

        // Navigate if route exists
        if (item.route) {
            const route = item.route.startsWith('/') ? item.route : `/${item.route}`;
            navigate(route);
        }

        setIsMoreMenuOpen(false);
    };

    // Helper function to get badge count from badge object or string
    const getBadgeCount = (badge) => {
        if (!badge) return null;
        if (typeof badge === 'object' && badge !== null && badge.count !== undefined) {
            return badge.count;
        }
        return badge;
    };

    // Helper function to get badge color from badge object
    const getBadgeColor = (badge) => {
        if (!badge || typeof badge !== 'object' || badge === null) {
            return undefined;
        }
        return badge.color || undefined;
    };

    // Render navigation item
    const renderNavItem = (navItem, index) => {
        const isSelected = selectedNavKey === navItem.key;
        const badgeCount = getBadgeCount(navItem.badge);
        const badgeColor = getBadgeColor(navItem.badge);

        // Use filled icon when selected, outline when not
        const iconClass = isSelected ? navItem.icon : navItem.iconOutline;

        return (
            <motion.div
                key={navItem.key}
                style={{
                    ...styles.navItemStyle,
                    ...(isSelected ? styles.navItemSelectedStyle : {}),
                }}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                whileTap="tap"
                custom={index}
                onClick={() => handleNavItemClick(navItem)}
            >
                {/* Icon with badge */}
                <div style={styles.iconContainerStyle}>
                    {badgeCount ? (
                        <Badge
                            count={badgeCount}
                            size="small"
                            color={badgeColor}
                            offset={[0, 0]}
                            style={styles.badgeStyle}
                        >
                            <i
                                className={iconClass}
                                style={{
                                    ...styles.iconStyle,
                                    ...(isSelected ? styles.iconSelectedStyle : {}),
                                }}
                            />
                        </Badge>
                    ) : (
                        <i
                            className={iconClass}
                            style={{
                                ...styles.iconStyle,
                                ...(isSelected ? styles.iconSelectedStyle : {}),
                            }}
                        />
                    )}
                </div>

                {/* Label */}
                <span
                    style={{
                        ...styles.labelStyle,
                        ...(isSelected ? styles.labelSelectedStyle : {}),
                    }}
                >
                    {navItem.label}
                </span>
            </motion.div>
        );
    };

    // Only pass main menus - they already contain their children (sidebar menus)
    // This prevents duplication in the More menu
    const allMenusForMore = mainMenus;

    return (
        <>
            <nav
                className={`mobile-bottom-navigation ${className}`}
                style={{
                    ...styles.containerStyle,
                    ...style,
                }}
            >
                {/* Static Navigation Items */}
                {staticNavItems.map((navItem, index) => renderNavItem(navItem, index))}
            </nav>

            {/* More Menu - Shows ALL menus in hierarchical structure */}
            <MobileMoreMenu
                isOpen={isMoreMenuOpen}
                onClose={() => setIsMoreMenuOpen(false)}
                menuItems={allMenusForMore}
                selectedKey={selectedSidebarKey}
                onItemSelect={handleMoreMenuItemSelect}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
            />
        </>
    );
};

export default MobileBottomNavigation;
