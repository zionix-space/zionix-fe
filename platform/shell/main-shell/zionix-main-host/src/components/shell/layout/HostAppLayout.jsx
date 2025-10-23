import React, { useState } from "react";
import { theme } from "antd";
import AppTopBar from "./AppTopBar";
import AppSidebar from "./AppSidebar";

const { useToken } = theme;

const HostAppLayout = ({ children }) => {
  const { token } = useToken();
  const [collapsed, setCollapsed] = useState(false);
  // Main container style - simple div instead of Ant Layout
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    background: token.colorBgLayout,
    overflow: "hidden", // Prevent page-level scrolling
    position: "relative",
  };

  // Content area style - positioned to account for fixed sidebar and top bar
  const contentStyle = {
    background: token.colorBgContainer,
    position: "absolute",
    top: "64px", // Account for top bar height
    insetInlineStart: collapsed ? "76px" : "260px", // Account for sidebar width - RTL aware
    insetInlineEnd: "0",
    bottom: "0",
    padding: "24px",
    overflow: "auto", // Only content should scroll
    transition: "inset-inline-start 0.2s ease", // Smooth transition when sidebar collapses - RTL aware
  };

  return (
    <div style={containerStyle}>
      {/* Fixed Top Bar */}
      <AppTopBar />

      {/* Fixed Sidebar */}
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Content Area */}
      <div style={contentStyle}>
        {children || (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "400px",
              color: token.colorTextSecondary,
              fontSize: "16px",
            }}
          >
            Main content area - your app content goes here
          </div>
        )}
      </div>
    </div>
  );
};

export default HostAppLayout;
