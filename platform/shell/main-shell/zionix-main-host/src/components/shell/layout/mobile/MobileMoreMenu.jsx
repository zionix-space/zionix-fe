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

  // Convert menu items to Ant Design Menu format
  const formatMenuItems = (items) => {
    return items.map(item => {
      const menuItem = {
        key: item.key,
        icon: item.icon,
        label: item.label,
      };

      if (item.children && item.children.length > 0) {
        menuItem.children = formatMenuItems(item.children);
      }

      return menuItem;
    });
  };

  const formattedMenuItems = formatMenuItems(menuItems);

  const handleMenuSelect = ({ key }) => {
    // Find the selected item in the menu structure
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

    const selectedItem = findMenuItem(menuItems, key);
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