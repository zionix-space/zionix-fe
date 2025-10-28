import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@zionix/design-system";
import { useStyles, dropdownVariants, backdropVariants } from "./MobileProfileDropdown.style";

/**
 * Mobile Profile Dropdown Component - Replicates desktop sidebar profile functionality
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dropdown is open
 * @param {Function} props.onClose - Callback function to close the dropdown
 * @param {Object} props.userData - User data object with name, email, avatar
 * @param {Array} props.menuItems - Array of menu items to display
 * @param {Function} [props.onMenuItemClick] - Callback function when menu item is clicked
 */
export const MobileProfileDropdown = ({ 
  isOpen, 
  onClose, 
  userData,
  menuItems,
  onMenuItemClick 
}) => {
  const { token } = useTheme();
  const styles = useStyles(token);
  const dropdownRef = useRef(null);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close dropdown
  const handleBackdropClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (item) => {
    console.log("Profile menu item clicked:", item.key);
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    onClose();
  };

  // Render menu item
  const renderMenuItem = (item, index) => {
    if (item.type === "divider") {
      return (
        <div key={`divider-${index}`} style={styles.dividerStyle} />
      );
    }

    return (
      <div
        key={item.key}
        style={styles.menuItemStyle}
        onClick={() => handleMenuItemClick(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleMenuItemClick(item);
          }
        }}
      >
        <div style={styles.menuItemIconStyle}>
          {item.icon ? <i className={item.icon} /> : null}
        </div>
        <span style={styles.menuItemLabelStyle}>
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={styles.overlayStyle}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            style={styles.backdropStyle}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />

          {/* Profile Dropdown */}
          <motion.div
            ref={dropdownRef}
            style={styles.dropdownStyle}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div style={styles.profileHeaderStyle}>
              <div style={styles.avatarContainerStyle}>
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  style={styles.avatarImageStyle}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{...styles.avatarFallbackStyle, display: 'none'}}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <div style={styles.profileInfoStyle}>
                <div style={styles.profileNameStyle}>
                  {userData.name}
                </div>
                <div style={styles.profileEmailStyle}>
                  {userData.email}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={styles.menuContainerStyle}>
              {menuItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileProfileDropdown;