import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@zionix/design-system";
import { useStyles, dropdownVariants, backdropVariants, injectProfileDropdownCSS } from "./MobileProfileDropdown.style";
import { logout } from '@zionix/authentication';
import { useAuthStore } from '@zionix/shared-utilities/stores/core/useAuthStore';

/**
 * Mobile Profile Dropdown Component - Premium Apple-style profile menu
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dropdown is open
 * @param {Function} props.onClose - Callback function to close the dropdown
 * @param {Object} props.userData - User data object with name, email, avatar
 * @param {Array} props.menuItems - Array of menu items to display
 */
export const MobileProfileDropdown = ({
  isOpen,
  onClose,
  userData,
  menuItems,
}) => {
  const { token } = useTheme();
  const styles = useStyles(token);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  // Inject CSS for hover effects
  useEffect(() => {
    injectProfileDropdownCSS(token);
  }, [token]);

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
  const handleMenuItemClick = async (item) => {
    console.log("Profile menu item clicked:", item.key);

    // Handle logout action
    if (item.key === 'logout') {
      try {
        // Clear auth store (this also clears localStorage)
        clearAuth();

        // Dispatch logout event for all microfrontends
        window.dispatchEvent(new CustomEvent('auth:logout'));

        // Navigate to root path
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Ensure navigation happens even if there's an error
        navigate('/');
      }
    } else if (item.path) {
      // Navigate to the item's path
      navigate(item.path);
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

    const isDanger = item.key === 'logout';

    return (
      <div
        key={item.key}
        className="mobile-profile-menu-item"
        style={{
          ...styles.menuItemStyle,
          ...(isDanger && { color: token.colorError }),
        }}
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
        <div
          className="mobile-profile-menu-icon"
          style={{
            ...styles.menuItemIconStyle,
            ...(isDanger && { color: token.colorError }),
          }}
        >
          {item.icon ? <i className={item.icon} /> : null}
        </div>
        <span
          style={{
            ...styles.menuItemLabelStyle,
            ...(isDanger && { color: token.colorError }),
          }}
        >
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
            className="mobile-profile-dropdown"
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
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    style={styles.avatarImageStyle}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  ...styles.avatarFallbackStyle,
                  display: userData.avatar ? 'none' : 'flex'
                }}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <div style={styles.profileInfoStyle}>
                <div style={styles.profileNameStyle}>
                  {userData.name || 'User'}
                </div>
                <div style={styles.profileEmailStyle}>
                  {userData.email || 'user@example.com'}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={styles.menuContainerStyle}>
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((item, index) => renderMenuItem(item, index))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: token.colorTextSecondary }}>
                  No menu items available
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileProfileDropdown;