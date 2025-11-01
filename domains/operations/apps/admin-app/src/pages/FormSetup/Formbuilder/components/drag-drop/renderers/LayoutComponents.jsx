import React from "react";
import {
  Button,
  Divider,
  Space,
} from "antd";

/**
 * Renders layout and general components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const LayoutComponents = ({ component, commonProps }) => {
  switch (component.type) {
    // Layout Components
    case "divider":
      return (
        <div style={{ padding: "8px" }}>
          <Divider style={{ margin: "8px 0" }}>
            {component.children || "Divider"}
          </Divider>
        </div>
      );
    
    case "space":
      return (
        <div style={{ padding: "8px" }}>
          <Space size="small">
            <Button size="small">Button 1</Button>
            <Button size="small">Button 2</Button>
          </Space>
        </div>
      );

    // General Components
    case "button":
      return (
        <div style={{ padding: "8px" }}>
          <Button size="small" type="primary">
            {component.text || "Button"}
          </Button>
        </div>
      );
    
    case "typography":
      return (
        <div style={{ padding: "8px" }}>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {component.text || "Typography Text"}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default LayoutComponents;