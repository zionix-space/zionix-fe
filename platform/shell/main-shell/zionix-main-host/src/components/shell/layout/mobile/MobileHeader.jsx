import React from "react";
import { Input, Button, theme } from "antd";
import { motion } from "framer-motion";
import { useTheme, ZionixLogo } from "@zionix/design-system";
import { useResponsiveLayout } from "../shared/ResponsiveLayoutProvider";
import { 
  useStyles, 
  headerVariants, 
  logoVariants, 
  searchVariants,
  themeToggleVariants 
} from "./MobileHeader.style";

const { useToken } = theme;

/**
 * Mobile Header Component - Beautiful header with logo, search, and theme switch
 * @param {Object} props - Component props
 * @param {string} [props.className=''] - Additional CSS class names
 * @param {Object} [props.style={}] - Additional inline styles
 */
const MobileHeader = ({
  className = "",
  style = {},
}) => {
  const { token } = useToken();
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = useStyles(token);

  const { deviceType } = useResponsiveLayout();

  // Only render on mobile devices
  if (deviceType !== "mobile") {
    return null;
  }

  return (
    <motion.header
      className={`mobile-header ${className}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{
        ...styles.headerContainerStyle,
        ...style,
      }}
    >
      {/* Left Section - Logo */}
      <motion.div
        className="mobile-header-left"
        style={styles.leftSectionStyle}
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <ZionixLogo size={32} useThemeColors={true} />
      </motion.div>

      {/* Center Section - Search Bar */}
      <motion.div
        className="mobile-header-center"
        style={styles.centerSectionStyle}
        variants={searchVariants}
        initial="hidden"
        animate="visible"
      >
        <Input
          placeholder="Search"
          prefix={<i className="ri-search-line" style={styles.searchIconStyle} />}
          style={styles.searchInputStyle}
          variant="filled"
        />
      </motion.div>

      {/* Right Section - Theme Switch */}
      <motion.div
        className="mobile-header-right"
        style={styles.rightSectionStyle}
        variants={themeToggleVariants}
        initial="hidden"
        animate="visible"
      >
        <Button
          type="text"
          icon={isDarkMode ? <i className="ri-sun-line" /> : <i className="ri-moon-line" />}
          onClick={toggleTheme}
          style={styles.themeToggleStyle}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        />
      </motion.div>
    </motion.header>
  );
};

export default MobileHeader;
