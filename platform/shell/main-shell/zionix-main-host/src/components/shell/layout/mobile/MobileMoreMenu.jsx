import React, { useEffect, useRef } from 'react';
import { Badge, Menu, theme } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@zionix/design-system';
import { 
  useStyles, 
  backdropVariants, 
  menuVariants, 
  handleBarVariants, 
  headerVariants,
  contentVariants,
  generateMenuItemCSS 
} from './MobileMoreMenu.style';

const { useToken } = theme;

/**
 * Mobile More Menu Component - Native iOS-style slide-up menu with smooth animations
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Function to close the menu
 * @param {Array} props.menuItems - Array of menu items to display
 * @param {string} props.selectedKey - Currently selected menu item key
 * @param {Function} props.onItemSelect - Function called when menu item is selected
 * @param {Array} [props.openKeys] - Array of open submenu keys
 * @param {Function} [props.onOpenChange] - Function called when submenu open state changes
 */
const MobileMoreMenu = ({ 
  isOpen, 
  onClose, 
  menuItems, 
  selectedKey, 
  onItemSelect,
  openKeys,
  onOpenChange 
}) => {
  const { token } = useToken();
  const styles = useStyles(token);
  
  const menuRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    onItemSelect(item);
    onClose();
  };

  // Filter out main navigation items that are already in the bottom navigation
  const mainNavigationKeys = ['dashboard', 'products', 'calendar', 'my-tasks', 'more'];
  
  const filterMainNavigationItems = (items) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.filter(item => {
      // Exclude main navigation items
      if (mainNavigationKeys.includes(item.key)) {
        return false;
      }
      
      // For items with children, filter their children recursively
      if (item.children && item.children.length > 0) {
        item.children = filterMainNavigationItems(item.children);
        // Keep parent if it has remaining children
        return item.children.length > 0;
      }
      
      return true;
    });
  };

  // Convert menu items to Ant Design Menu format
  const formatMenuItems = (items) => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.map(item => {
      const badgeCount = getBadgeCount(item.badge);
      const badgeColor = getBadgeColor(item.badge);
      
      const menuItem = {
        key: item.key,
        icon: item.icon ? <i className={item.icon} /> : null,
        label: badgeCount ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>{item.label}</span>
            <Badge 
              count={badgeCount} 
              size="small" 
              color={badgeColor}
            />
          </div>
        ) : item.label,
      };

      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  // Account Settings section items (matching desktop sidebar)
  const accountSettingsItems = [
    {
      key: "messages",
      icon: "ri-message-3-line",
      label: "Messages",
      badge: "3"
    },
    {
      key: "notifications",
      icon: "ri-notification-3-line",
      label: "Notifications", 
      badge: "12"
    },
    {
      key: "help-support",
      icon: "ri-customer-service-2-line",
      label: "Help & Support"
    },
    {
      key: "settings",
      icon: "ri-settings-3-line",
      label: "Settings"
    }
  ];

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

  // Filter and format menu items for the More menu
  const filteredMenuItems = filterMainNavigationItems(menuItems || []);
  const formattedMenuItems = [
    ...formatMenuItems(filteredMenuItems),
    ...accountSettingsItems.map(item => {
      const badgeCount = getBadgeCount(item.badge);
      const badgeColor = getBadgeColor(item.badge);
      
      return {
        key: item.key,
        icon: item.icon ? <i className={item.icon} /> : null,
        label: badgeCount ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>{item.label}</span>
            <Badge 
              count={badgeCount} 
              size="small" 
              color={badgeColor}
            />
          </div>
        ) : item.label
      };
    })
  ];

  const handleMenuSelect = ({ key }) => {
    // Check if it's an Account Settings item first
    const accountSettingsItem = accountSettingsItems.find(item => item.key === key);
    if (accountSettingsItem) {
      handleItemClick(accountSettingsItem);
      return;
    }

    // Find the selected item in the filtered menu structure
    const findMenuItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedItem = findMenuItem(filteredMenuItems, key);
    if (selectedItem) {
      handleItemClick(selectedItem);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with iOS-style blur and smooth animation */}
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={styles.backdropStyle}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Container with native iOS styling and smooth animations */}
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={styles.menuContainerStyle}
            role="dialog"
            aria-modal="true"
            aria-label="More menu options"
          >
            {/* Handle Bar - iOS style with animation */}
            <motion.div
              variants={handleBarVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={styles.handleBarContainerStyle}
            >
              <motion.div
                whileHover={{ scaleX: 1.2 }}
                whileTap={{ scaleX: 0.9 }}
                style={styles.handleBarStyle}
                onClick={onClose}
              />
            </motion.div>

            {/* Header with iOS typography and animation */}
            <motion.div
              variants={headerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={styles.headerContainerStyle}
            >
              <h3
                style={styles.headerTitleStyle}
              >
                More
              </h3>
            </motion.div>

            {/* Menu Items with Ant Design Menu component and animations */}
            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={styles.contentContainerStyle}
            >
              <div className="mobile-more-menu-container">
                <Menu
                  mode="inline"
                  selectedKeys={[selectedKey]}
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  onSelect={handleMenuSelect}
                  items={formattedMenuItems}
                  style={styles.menuStyle}
                  theme="light"
                  expandIcon={({ isOpen }) => (
                    <motion.i 
                      className={`ri-arrow-${isOpen ? 'down' : 'right'}-s-line`}
                      animate={{ rotate: isOpen ? 0 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={styles.expandIconStyle}
                    />
                  )}
                />
              </div>
              
              <style dangerouslySetInnerHTML={{
                __html: generateMenuItemCSS(token)
              }} />
            </motion.div>

            {/* Safe area padding for devices with home indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={styles.safeAreaStyle}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMoreMenu;