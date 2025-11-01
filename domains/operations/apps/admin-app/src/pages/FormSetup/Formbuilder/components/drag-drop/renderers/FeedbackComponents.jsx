import React from "react";
import {
  Alert,
  Progress,
  Skeleton,
  Spin,
} from "antd";

/**
 * Renders feedback components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const FeedbackComponents = ({ component, commonProps }) => {
  switch (component.type) {
    case "alert":
      return (
        <div style={{ padding: "4px" }}>
          <Alert message="Sample Alert" type="info" size="small" showIcon />
        </div>
      );
    
    case "progress":
      return (
        <div style={{ padding: "8px" }}>
          <Progress percent={30} size="small" />
          <div
            style={{
              fontSize: "12px",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            Progress
          </div>
        </div>
      );
    
    case "skeleton":
      return (
        <div style={{ padding: "8px" }}>
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </div>
      );
    
    case "spin":
      return (
        <div style={{ padding: "8px", textAlign: "center" }}>
          <Spin size="small" />
          <div style={{ fontSize: "12px", marginTop: "8px" }}>
            Loading...
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default FeedbackComponents;