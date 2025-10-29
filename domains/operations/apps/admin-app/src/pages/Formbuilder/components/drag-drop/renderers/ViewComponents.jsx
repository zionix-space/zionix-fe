import React from "react";
import { Card, Typography } from "antd";
import { AppstoreOutlined, UnorderedListOutlined, TableOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * Renders view components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const ViewComponents = ({ component, commonProps }) => {
  switch (component.type) {
    case "gallery_view":
      return (
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AppstoreOutlined style={{ color: "#1890ff" }} />
              <Text strong>Gallery View</Text>
            </div>
          }
          style={{ width: "100%", minHeight: "120px" }}
        >
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "8px",
            padding: "8px 0"
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                style={{
                  height: "40px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                  border: "1px solid #d9d9d9"
                }}
              />
            ))}
          </div>
        </Card>
      );

    case "list_view":
      return (
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UnorderedListOutlined style={{ color: "#52c41a" }} />
              <Text strong>List View</Text>
            </div>
          }
          style={{ width: "100%", minHeight: "120px" }}
        >
          <div style={{ padding: "8px 0" }}>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                style={{
                  height: "24px",
                  background: "#f5f5f5",
                  borderRadius: "2px",
                  marginBottom: "4px",
                  border: "1px solid #d9d9d9"
                }}
              />
            ))}
          </div>
        </Card>
      );

    case "sheet_view":
      return (
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TableOutlined style={{ color: "#fa8c16" }} />
              <Text strong>Sheet View</Text>
            </div>
          }
          style={{ width: "100%", minHeight: "120px" }}
        >
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(4, 1fr)", 
            gap: "2px",
            padding: "8px 0"
          }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                style={{
                  height: "20px",
                  background: i < 4 ? "#e6f7ff" : "#f5f5f5",
                  border: "1px solid #d9d9d9",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {i < 4 ? String.fromCharCode(65 + i) : ""}
              </div>
            ))}
          </div>
        </Card>
      );

    case "view":
    case "embedded_view":
      // Render based on viewConfig.type if available
      if (component.viewConfig && component.viewConfig.type) {
        switch (component.viewConfig.type) {
          case "gallery":
            return (
              <Card
                size="small"
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <AppstoreOutlined style={{ color: "#1890ff" }} />
                    <Text strong>{component.label || "Gallery View"}</Text>
                  </div>
                }
                style={{ width: "100%", minHeight: "120px" }}
              >
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(3, 1fr)", 
                  gap: "8px",
                  padding: "8px 0"
                }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      style={{
                        height: "40px",
                        background: "#f5f5f5",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9"
                      }}
                    />
                  ))}
                </div>
              </Card>
            );
          case "list":
            return (
              <Card
                size="small"
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <UnorderedListOutlined style={{ color: "#52c41a" }} />
                    <Text strong>{component.label || "List View"}</Text>
                  </div>
                }
                style={{ width: "100%", minHeight: "120px" }}
              >
                <div style={{ padding: "8px 0" }}>
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        height: "24px",
                        background: "#f5f5f5",
                        borderRadius: "2px",
                        marginBottom: "4px",
                        border: "1px solid #d9d9d9"
                      }}
                    />
                  ))}
                </div>
              </Card>
            );
          case "sheet":
            return (
              <Card
                size="small"
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <TableOutlined style={{ color: "#fa8c16" }} />
                    <Text strong>{component.label || "Sheet View"}</Text>
                  </div>
                }
                style={{ width: "100%", minHeight: "120px" }}
              >
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(4, 1fr)", 
                  gap: "2px",
                  padding: "8px 0"
                }}>
                  {Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        height: "20px",
                        background: i < 4 ? "#e6f7ff" : "#f5f5f5",
                        border: "1px solid #d9d9d9",
                        fontSize: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {i < 4 ? String.fromCharCode(65 + i) : ""}
                    </div>
                  ))}
                </div>
              </Card>
            );
          default:
            // Fallback for unknown view types
            break;
        }
      }
      
      // Default fallback for embedded views
      return (
        <Card
          size="small"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AppstoreOutlined style={{ color: "#722ed1" }} />
              <Text strong>{component.label || "Embedded View"}</Text>
            </div>
          }
          style={{ width: "100%", minHeight: "120px" }}
        >
          <div style={{ 
            padding: "16px",
            textAlign: "center",
            color: "#666",
            background: "#fafafa",
            border: "2px dashed #d9d9d9",
            borderRadius: "4px"
          }}>
            <AppstoreOutlined style={{ fontSize: "24px", marginBottom: "8px", color: "#722ed1" }} />
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              {component.label || "Embedded View"}
            </div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>
              {component.viewConfig?.type ? `Type: ${component.viewConfig.type}` : "Custom View Component"}
            </div>
          </div>
        </Card>
       );

    default:
      return null;
  }
};

export default ViewComponents;