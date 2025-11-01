import React from "react";
import { Form } from "antd";
import DataEntryComponents from "./DataEntryComponents";
import DataDisplayComponents from "./DataDisplayComponents";
import FeedbackComponents from "./FeedbackComponents";
import NavigationComponents from "./NavigationComponents";
import LayoutComponents from "./LayoutComponents";
import ViewComponents from "./ViewComponents";

/**
 * Main component renderer that delegates to specific category renderers
 * @param {Object} component - Component configuration object
 * @returns {JSX.Element|null} Rendered component or null
 */
const ComponentRenderer = ({ component }) => {
  if (!component) return null;

  const commonProps = {
    placeholder: component.placeholder || component.label,
    disabled: true, // Disabled for drag preview
    size: "small",
    style: { width: "100%" },
  };

  // Try each category renderer in order
  const renderers = [
    DataEntryComponents,
    DataDisplayComponents,
    FeedbackComponents,
    NavigationComponents,
    LayoutComponents,
    ViewComponents,
  ];

  for (const Renderer of renderers) {
    const result = Renderer({ component, commonProps });
    if (result) {
      // Wrap with Form.Item to show labels in canvas preview
      return (
        <Form.Item
          label={component.label}
          style={{ marginBottom: "16px" }}
          layout="vertical"
        >
          {result}
        </Form.Item>
      );
    }
  }

  // Default fallback for unknown component types
  return (
    <Form.Item
      label={component.label || component.type}
      style={{ marginBottom: "16px" }}
    >
      <div style={{ padding: "8px", color: "#666", fontSize: "12px" }}>
        {component.label || component.content || component.type || "Block"}
      </div>
    </Form.Item>
  );
};

export default ComponentRenderer;
