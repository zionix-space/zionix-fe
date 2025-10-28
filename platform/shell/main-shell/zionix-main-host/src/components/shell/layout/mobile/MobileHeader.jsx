import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@zionix/design-system";
import { useResponsiveLayout } from "../shared/ResponsiveLayoutProvider";
import {
  useStyles,
  headerVariants,
  avatarVariants,
  centerIconsVariants,
  themeToggleVariants,
} from "./MobileHeader.style";
import { MobileSearchPopup } from "./MobileSearchPopup";
import { MobileProfileDropdown } from "./MobileProfileDropdown";
import { useMenuStore } from "../../../../data/stores/menu/useMenuStore";

export const MobileHeader = () => {
  const { token, isDarkMode, toggleTheme } = useTheme();
  const { deviceType } = useResponsiveLayout();
  const styles = useStyles(token);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  
  // Get profile data from unified menu structure - direct access like desktop
  const { completeMenuData } = useMenuStore();
  const profileData = completeMenuData?.profileSection || {
    userData: { name: "User", email: "user@example.com" },
    menuItems: []
  };

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  const handleNotificationClick = () => {
    console.log("Notification clicked");
  };

  const handleSearchClick = () => {
    setIsSearchPopupOpen(true);
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Handle search popup close
  const handleSearchPopupClose = () => {
    setIsSearchPopupOpen(false);
  };

  // Handle search functionality
  const handleSearch = (searchValue, filters) => {
    console.log("Search performed:", { searchValue, filters });
    // TODO: Implement actual search functionality
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    console.log("Filters changed:", filters);
    // TODO: Implement filter functionality
  };

  return (
    <motion.header
      style={styles.headerStyle}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Section - Compact Avatar Only */}
      <motion.div style={styles.leftSectionStyle} variants={avatarVariants}>
        <div style={styles.avatarStyle} onClick={handleProfileClick}>
          {profileData.userData.name ? profileData.userData.name.charAt(0).toUpperCase() : "U"}
        </div>
      </motion.div>

      {/* Center Section - Action Icons */}
      <motion.div style={styles.centerSectionStyle} variants={centerIconsVariants}>
        <button
          style={{...styles.actionIconStyle, ...styles.notificationIconStyle}}
          onClick={handleNotificationClick}
          aria-label="Notifications"
        >
          <i className="ri-notification-line" />
          <div style={styles.notificationBadgeStyle}></div>
        </button>

        <button
          style={styles.actionIconStyle}
          onClick={handleSearchClick}
          aria-label="Search"
        >
          <i className="ri-search-line" />
        </button>

        <button
          style={styles.actionIconStyle}
          onClick={handleSettingsClick}
          aria-label="Settings"
        >
          <i className="ri-settings-line" />
        </button>
      </motion.div>

      {/* Right Section - Theme Toggle Only */}
      <motion.div style={styles.rightSectionStyle} variants={themeToggleVariants}>
        <button
          style={styles.actionIconStyle}
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
        >
          <i className={isDarkMode ? "ri-sun-line" : "ri-moon-line"} />
        </button>
      </motion.div>

      {/* Search Popup */}
      <MobileSearchPopup
        isOpen={isSearchPopupOpen}
        onClose={handleSearchPopupClose}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Profile Dropdown */}
      <MobileProfileDropdown
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        userData={profileData.userData}
        menuItems={profileData.menuItems}
      />
    </motion.header>
  );
};

export default MobileHeader;
