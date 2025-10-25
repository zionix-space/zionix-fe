import React from "react";
import { Layout, Menu, Button, Avatar, Badge, Space, theme } from "antd";
// Using Remix Icons CSS classes for better performance
import { useTheme, ZionixLogo } from "@zionix/design-system";
import { useStyles } from "./DesktopTopBar.style";

const { Header } = Layout;
const { useToken } = theme;

const AppTopBar = () => {
  const { token } = useToken();
  const { isDarkMode, toggleTheme, isRTL, toggleRTL } = useTheme();
  const styles = useStyles(token);

  const navigationItems = [
    { key: "create", label: "Create" },
    { key: "publish", label: "Publish" },
    { key: "engage", label: "Engage" },
    { key: "analyze", label: "Analyze" },
    { key: "start-page", label: "Start Page" },
  ];

  return (
    <Header style={styles.topBarStyle}>
      {/* Left Section - Brand + Navigation */}
      <div style={styles.leftSectionStyle}>
        <div style={styles.brandContainerStyle}>
          <ZionixLogo size={48} style={{ marginRight: '16px' }} />
          <span style={styles.logoTextStyle}>Zionix</span>
        </div>
        
        <div style={styles.navigationContainerStyle}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["create"]}
            items={navigationItems}
            style={styles.menuStyle}
            theme="light"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <Space style={styles.rightActionsStyle}>
        <Badge count={3} size="small">
          <Button type="text" icon={<i className="ri-notification-line" />} style={styles.iconButtonStyle} />
        </Badge>

        <Button
          type="text"
          icon={<i className="ri-arrow-left-right-line" />}
          onClick={toggleRTL}
          style={styles.rtlToggleStyle(isRTL)}
          title={isRTL ? "Switch to LTR" : "Switch to RTL"}
        />

        <Button
          type="text"
          icon={isDarkMode ? <i className="ri-sun-line" /> : <i className="ri-moon-line" />}
          onClick={toggleTheme}
          style={styles.iconButtonStyle}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        />
      </Space>
    </Header>
  );
};

export default AppTopBar;
