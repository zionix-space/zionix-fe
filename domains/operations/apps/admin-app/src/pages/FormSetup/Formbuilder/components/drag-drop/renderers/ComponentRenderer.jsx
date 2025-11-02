import React, { Suspense, useMemo } from "react";
import { Form, Spin } from "antd";

// Lazy load heavy renderer components to reduce initial bundle size
const DataEntryComponents = React.lazy(() => import("./DataEntryComponents"));
const DataDisplayComponents = React.lazy(() => import("./DataDisplayComponents"));
const FeedbackComponents = React.lazy(() => import("./FeedbackComponents"));
const NavigationComponents = React.lazy(() => import("./NavigationComponents"));
const LayoutComponents = React.lazy(() => import("./LayoutComponents"));
const ViewComponents = React.lazy(() => import("./ViewComponents"));

// Lightweight loading fallback
const ComponentLoadingFallback = () => (
  <div style={{ padding: '8px', textAlign: 'center' }}>
    <Spin size="small" />
  </div>
);

// Component type to renderer mapping for better performance
const getRendererForType = (type) => {
  // Data Entry Components
  if (['input', 'textarea', 'number', 'date', 'select', 'radio', 'checkbox', 'switch', 'timepicker', 'autocomplete', 'cascader', 'colorpicker', 'mentions', 'transfer', 'treeselect', 'email', 'phone', 'url', 'password', 'currency', 'daterange', 'datetime', 'multiselect', 'checkboxgroup'].includes(type)) {
    return DataEntryComponents;
  }
  
  // Data Display Components  
  if (['avatar', 'badge', 'calendar', 'card', 'carousel', 'collapse', 'comment', 'descriptions', 'empty', 'image', 'list', 'popover', 'qrcode', 'segmented', 'statistic', 'table', 'tabs', 'tag', 'timeline', 'tooltip', 'tree'].includes(type)) {
    return DataDisplayComponents;
  }
  
  // Feedback Components
  if (['alert', 'drawer', 'message', 'modal', 'notification', 'popconfirm', 'progress', 'result', 'skeleton', 'spin'].includes(type)) {
    return FeedbackComponents;
  }
  
  // Navigation Components
  if (['breadcrumb', 'menu', 'pagination', 'steps'].includes(type)) {
    return NavigationComponents;
  }
  
  // Layout Components
  if (['divider', 'space', 'button', 'typography'].includes(type)) {
    return LayoutComponents;
  }
  
  // View Components
  if (['gallery_view', 'list_view', 'sheet_view', 'data_table'].includes(type)) {
    return ViewComponents;
  }
  
  return null;
};

/**
 * Lazy Component Wrapper that only loads the specific renderer needed
 */
const LazyComponentWrapper = ({ component, commonProps }) => {
  const RendererComponent = useMemo(() => getRendererForType(component.type), [component.type]);
  
  if (!RendererComponent) {
    return (
      <div style={{ padding: "8px", color: "#666", fontSize: "12px" }}>
        {component.label || component.content || component.type || "Block"}
      </div>
    );
  }
  
  return (
    <Suspense fallback={<ComponentLoadingFallback />}>
      <RendererComponent component={component} commonProps={commonProps} />
    </Suspense>
  );
};

/**
 * Main component renderer that delegates to specific category renderers
 * @param {Object} component - Component configuration object
 * @returns {JSX.Element|null} Rendered component or null
 */
const ComponentRenderer = ({ component }) => {
  if (!component) return null;

  const commonProps = useMemo(() => ({
    placeholder: component.placeholder || component.label,
    disabled: true, // Disabled for drag preview
    size: "small",
    style: { width: "100%" },
  }), [component.placeholder, component.label]);

  return (
    <Form.Item
      label={component.label}
      style={{ marginBottom: "16px" }}
      layout="vertical"
    >
      <LazyComponentWrapper component={component} commonProps={commonProps} />
    </Form.Item>
  );
};

export default ComponentRenderer;
