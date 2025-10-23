import React from "react";
import { Layout, Menu, Button, Avatar, Badge, Space, theme } from "antd";
// Remix Icons are now used via CSS classes
import { useTheme } from "@zionix/design-system";

const { Header } = Layout;
const { useToken } = theme;

const AppTopBar = () => {
  const { token } = useToken();
  const { isDarkMode, toggleTheme, isRTL, toggleRTL } = useTheme();

  const topBarStyle = {
    background: token.colorBgContainer,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: "20px",
    fontWeight: 600,
    color: token.colorPrimary,
    marginRight: "32px",
  };

  const navigationItems = [
    { key: "create", label: "Create" },
    { key: "publish", label: "Publish" },
    { key: "engage", label: "Engage" },
    { key: "analyze", label: "Analyze" },
    { key: "start-page", label: "Start Page" },
  ];

  const menuStyle = {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: 500,
  };

  const rightActionsStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconButtonStyle = {
    border: "none",
    background: "transparent",
    color: token.colorTextSecondary,
    fontSize: "16px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Header style={topBarStyle}>
      {/* Left Section - Logo and Navigation */}
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div style={logoStyle}>Zionix</div>

        {/* Navigation Menu - starts right after logo */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["create"]}
          items={navigationItems}
          style={menuStyle}
          theme="light"
        />
      </div>

      {/* Right Section - Actions */}
      <Space style={rightActionsStyle}>
        <Badge count={3} size="small">
          <Button type="text" icon={<i className="ri-notification-line" />} style={iconButtonStyle} />
        </Badge>

        <Button
          type="text"
          icon={<i className="ri-swap-line" />}
          onClick={toggleRTL}
          style={{
            ...iconButtonStyle,
            color: isRTL ? token.colorPrimary : token.colorTextSecondary,
          }}
          title={isRTL ? "Switch to LTR" : "Switch to RTL"}
        />

        <Button
          type="text"
          icon={isDarkMode ? <i className="ri-sun-line" /> : <i className="ri-moon-line" />}
          onClick={toggleTheme}
          style={iconButtonStyle}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        />
      </Space>
    </Header>
  );
};

export default AppTopBar;
