import React from "react";
import {
  Breadcrumb,
  Menu,
  Pagination,
  Steps,
} from "antd";

/**
 * Renders navigation components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const NavigationComponents = ({ component, commonProps }) => {
  switch (component.type) {
    case "breadcrumb":
      return (
        <div style={{ padding: "8px" }}>
          <Breadcrumb items={[{ title: "Home" }, { title: "Page" }]} />
        </div>
      );
    
    case "menu":
      return (
        <div style={{ padding: "4px" }}>
          <Menu
            mode="horizontal"
            items={[{ key: "1", label: "Menu Item" }]}
            style={{ border: "none", fontSize: "12px" }}
          />
        </div>
      );
    
    case "pagination":
      return (
        <div style={{ padding: "8px", textAlign: "center" }}>
          <Pagination simple current={1} total={50} size="small" />
        </div>
      );
    
    case "steps":
      return (
        <div style={{ padding: "8px" }}>
          <Steps
            size="small"
            current={1}
            items={[{ title: "Step 1" }, { title: "Step 2" }]}
          />
        </div>
      );

    default:
      return null;
  }
};

export default NavigationComponents;