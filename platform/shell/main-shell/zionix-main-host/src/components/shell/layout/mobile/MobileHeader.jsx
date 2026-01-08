import { useState, useEffect } from "react";
import { ColorPicker } from "antd";
import { motion } from "framer-motion";
import { useTheme } from "@zionix/design-system";
import { useResponsiveLayout } from "../shared/ResponsiveLayoutProvider";
import { useStyles, headerVariants, injectHeaderCSS } from "./MobileHeader.style";
import { MobileProfileDropdown } from "./MobileProfileDropdown";
import { useMenuData } from "../../../../data/hooks/menu";

/**
 * Mobile Header Component - Premium Native iOS Feel
 * Clean header with profile dropdown, theme switcher, and color picker
 */
export const MobileHeader = () => {
  const { token, isDarkMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const { deviceType } = useResponsiveLayout();
  const styles = useStyles(token);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Get profile data from unified menu hook (same as desktop)
  const { profileSection } = useMenuData();

  const profileData = profileSection || {
    userData: { name: "User", email: "user@example.com" },
    menuItems: []
  };

  // Inject CSS for hover effects
  useEffect(() => {
    injectHeaderCSS(token);
  }, [token]);

  // Only render on mobile devices
  if (deviceType !== 'mobile') {
    return null;
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <motion.header
      className="mobile-header"
      style={styles.headerStyle}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar + Account Dropdown */}
      <div
        className="mobile-header-account"
        style={styles.accountContainerStyle}
        onClick={handleProfileClick}
      >
        {/* Avatar */}
        <div style={styles.avatarStyle}>
          {profileData.userData?.name ? profileData.userData.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Account Text + Dropdown Arrow */}
        <div style={styles.accountTextContainerStyle}>
          <span style={styles.accountTextStyle}>My Account</span>
          <motion.i
            className="ri-arrow-down-s-line"
            style={styles.dropdownIconStyle}
            animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Right side controls container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme Switcher Capsule */}
        <div style={styles.themeContainerStyle}>
          {/* Light Mode Button */}
          <motion.div
            style={{
              ...styles.themeButtonStyle,
              ...(!isDarkMode ? styles.themeButtonActiveStyle : {}),
            }}
            onClick={() => !isDarkMode || toggleTheme()}
            whileTap={{ scale: 0.95 }}
            role="button"
            aria-label="Switch to light mode"
          >
            <i
              className="ri-sun-line"
              style={{
                ...styles.themeIconStyle,
                ...(!isDarkMode ? styles.themeIconActiveStyle : {}),
              }}
            />
          </motion.div>

          {/* Dark Mode Button */}
          <motion.div
            style={{
              ...styles.themeButtonStyle,
              ...(isDarkMode ? styles.themeButtonActiveStyle : {}),
            }}
            onClick={() => isDarkMode || toggleTheme()}
            whileTap={{ scale: 0.95 }}
            role="button"
            aria-label="Switch to dark mode"
          >
            <i
              className="ri-moon-line"
              style={{
                ...styles.themeIconStyle,
                ...(isDarkMode ? styles.themeIconActiveStyle : {}),
              }}
            />
          </motion.div>
        </div>

        {/* Color Picker Capsule */}
        <div style={styles.colorPickerContainerStyle}>
          <ColorPicker
            value={primaryColor}
            onChange={(color) => setPrimaryColor(color.toHexString())}
            size="small"
            showText={false}
            presets={[
              {
                label: 'Recommended',
                colors: [
                  '#1677ff', // Blue
                  '#52c41a', // Green
                  '#fa8c16', // Orange
                  '#eb2f96', // Pink
                  '#722ed1', // Purple
                  '#13c2c2', // Cyan
                ],
              },
            ]}
            panelRender={(panel) => (
              <div style={{ padding: 8 }}>
                {panel}
              </div>
            )}
          >
            <motion.div
              style={styles.colorPickerButtonStyle}
              whileTap={{ scale: 0.95 }}
              role="button"
              aria-label="Change primary color"
            >
              <i
                className="ri-palette-line"
                style={styles.colorPickerIconStyle}
              />
            </motion.div>
          </ColorPicker>
        </div>
      </div>

      {/* Profile Dropdown */}
      <MobileProfileDropdown
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        userData={profileData.userData || { name: "User", email: "user@example.com" }}
        menuItems={profileData.menuItems || []}
      />
    </motion.header>
  );
};

export default MobileHeader;
