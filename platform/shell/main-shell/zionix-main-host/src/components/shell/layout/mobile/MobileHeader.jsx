import React, { useState } from "react";
import { Dropdown } from "antd";
import { motion } from "framer-motion";
import { useTheme } from "@zionix/design-system";
import { useResponsiveLayout } from "../shared/ResponsiveLayoutProvider";
import { useStyles, headerVariants } from "./MobileHeader.style";
import { MobileProfileDropdown } from "./MobileProfileDropdown";
import { useMenuStore } from "../../../../data/stores/menu/useMenuStore";

/**
 * Mobile Header Component - Premium Fintech Native Feel
 * Clean header with avatar + account dropdown
 */
export const MobileHeader = () => {
  const { token } = useTheme();
  const { deviceType } = useResponsiveLayout();
  const styles = useStyles(token);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Get profile data from unified menu structure
  const { completeMenuData } = useMenuStore();
  const profileData = completeMenuData?.profileSection || {
    userData: { name: "User", email: "user@example.com" },
    menuItems: []
  };

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <motion.header
      style={styles.headerStyle}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar + Account Dropdown */}
      <div style={styles.accountContainerStyle} onClick={handleProfileClick}>
        {/* Avatar */}
        <div style={styles.avatarStyle}>
          {profileData.userData.name ? profileData.userData.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Account Text + Dropdown Arrow */}
        <div style={styles.accountTextContainerStyle}>
          <span style={styles.accountTextStyle}>My Account</span>
          <i className="ri-arrow-down-s-line" style={styles.dropdownIconStyle} />
        </div>
      </div>

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
