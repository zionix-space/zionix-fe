import React from "react";
import {
  Avatar,
  Badge,
  Tag,
  Select,
  Input,
  QRCode,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";

/**
 * Renders data display components for the form builder drag preview
 * @param {Object} component - Component configuration object
 * @param {Object} commonProps - Common props applied to all components
 * @returns {JSX.Element|null} Rendered component or null
 */
const DataDisplayComponents = ({ component, commonProps }) => {
  switch (component.type) {
    case "avatar":
      return (
        <div
          style={{
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Avatar size="small" icon={<UserOutlined />} />
          <span style={{ fontSize: "12px" }}>Avatar</span>
        </div>
      );
    
    case "badge":
      return (
        <div
          style={{
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Badge count={5} size="small">
            <div
              style={{
                width: "30px",
                height: "20px",
                background: "#f0f0f0",
                borderRadius: "4px",
              }}
            />
          </Badge>
          <span style={{ fontSize: "12px" }}>Badge</span>
        </div>
      );
    
    case "calendar":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            textAlign: "center",
            fontSize: "12px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📅 Calendar Component
        </div>
      );
    
    case "carousel":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#364d79",
            color: "white",
            textAlign: "center",
            fontSize: "12px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🎠 Carousel Component
        </div>
      );
    
    case "descriptions":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            fontSize: "12px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            Name:
          </div>
          <div>Sample Value</div>
        </div>
      );
    
    case "empty":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            textAlign: "center",
            fontSize: "12px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          📭 Empty State
        </div>
      );
    
    case "image":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#f0f0f0",
            textAlign: "center",
            fontSize: "12px",
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🖼️ Image Component
        </div>
      );
    
    case "list":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            fontSize: "12px",
          }}
        >
          <div style={{ marginBottom: "4px" }}>• List Item 1</div>
          <div>• List Item 2</div>
        </div>
      );
    
    case "tag":
      return (
        <div
          style={{
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Tag size="small" color="blue">
            {component.text || "Tag"}
          </Tag>
          <span style={{ fontSize: "12px" }}>Tag</span>
        </div>
      );
    
    case "timeline":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            fontSize: "12px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#1890ff",
                borderRadius: "50%",
              }}
            />
            <span>Timeline Item</span>
          </div>
        </div>
      );
    
    case "tree":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            fontSize: "12px",
          }}
        >
          <div>📁 Parent Node</div>
          <div style={{ marginLeft: "16px", marginTop: "4px" }}>
            📄 Child Node
          </div>
        </div>
      );
    
    case "table":
      return (
        <div
          style={{
            padding: "8px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            background: "#fafafa",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              borderBottom: "1px solid #d9d9d9",
              paddingBottom: "4px",
              marginBottom: "4px",
            }}
          >
            <div style={{ flex: 1 }}>Name</div>
            <div style={{ flex: 1 }}>Age</div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>John</div>
            <div style={{ flex: 1 }}>25</div>
          </div>
        </div>
      );

    // Data Lookup Components
    case "lookup":
      return (
        <Select 
          {...commonProps} 
          showSearch
          placeholder="Search and select..."
          suffixIcon={<SearchOutlined />}
        >
          <Select.Option value="item1">Sample Item 1</Select.Option>
          <Select.Option value="item2">Sample Item 2</Select.Option>
        </Select>
      );
    
    case "reference":
      return (
        <Select 
          {...commonProps} 
          placeholder="Select reference..."
        >
          <Select.Option value="ref1">Reference 1</Select.Option>
          <Select.Option value="ref2">Reference 2</Select.Option>
        </Select>
      );

    // Widget Components
    case "qrcode":
      return (
        <div style={{ padding: "8px", textAlign: "center" }}>
          <QRCode 
            value="https://example.com" 
            size={64}
            style={{ border: "1px solid #d9d9d9" }}
          />
          <div style={{ fontSize: "10px", marginTop: "4px" }}>QR Code</div>
        </div>
      );
    
    case "barcode":
      return (
        <div style={{ 
          padding: "8px", 
          textAlign: "center",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          background: "#f5f5f5"
        }}>
          <div style={{ 
            fontSize: "10px", 
            fontFamily: "monospace",
            letterSpacing: "2px"
          }}>
            ||||| |||| ||||||
          </div>
          <div style={{ fontSize: "8px", marginTop: "2px" }}>123456789</div>
        </div>
      );
    
    case "signature":
      return (
        <div style={{ 
          padding: "8px", 
          border: "1px dashed #d9d9d9",
          borderRadius: "4px",
          textAlign: "center",
          background: "#fafafa",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{ fontSize: "12px", color: "#999" }}>✍️ Signature Pad</span>
        </div>
      );
    
    case "location":
      return (
        <div style={{ 
          padding: "8px", 
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          textAlign: "center",
          background: "#f0f2f5",
          minHeight: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{ fontSize: "12px" }}>📍 Location Picker</span>
        </div>
      );

    default:
      return null;
  }
};

export default DataDisplayComponents;