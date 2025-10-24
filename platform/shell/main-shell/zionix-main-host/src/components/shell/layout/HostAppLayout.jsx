import React, { useState } from "react";
import { theme } from "antd";
import AppTopBar from "./AppTopBar";
import AppSidebar from "./AppSidebar";
import { useStyles } from "./HostAppLayout.style";

const { useToken } = theme;

const HostAppLayout = ({ children }) => {
  const { token } = useToken();
  const [collapsed, setCollapsed] = useState(false);
  const styles = useStyles(token);

  return (
    <div style={styles.containerStyle}>
      {/* Fixed Top Bar */}
      <AppTopBar />

      {/* Fixed Sidebar */}
      <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Content Area */}
      <div style={styles.contentStyle(collapsed)}>
        {children || (
          <div style={styles.defaultContentStyle(token)}>
            Main content area - your app content goes here
          </div>
        )}
      </div>
    </div>
  );
};

export default HostAppLayout;
