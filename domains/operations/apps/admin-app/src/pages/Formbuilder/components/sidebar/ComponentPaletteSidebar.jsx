import React, { useState, useMemo } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SIDEBAR_ITEMS } from "../../constants";
import SideBarItem from "../drag-drop/SideBarItem";

// Categorize components based on Lowcode's structure
const categorizeComponents = (components) => {
  const categories = {
    BASIC: [],
    ADVANCED: [],
    "FILE & MEDIA": [],
    "DATA LOOKUP": [],
    WIDGET: [],
  };

  components.forEach((component) => {
    const type = component.component.type;

    // Basic fields - primary form inputs (matching Lowcode basic fields)
    if (
      [
        "input",
        "textarea",
        "number",
        "date",
        "select",
        "radio",
        "checkbox",
        "switch",
        "timepicker",
      ].includes(type)
    ) {
      categories["BASIC"].push(component);
    }
    // Advanced fields - specialized functionality and enhanced inputs
    else if (
      [
        "autocomplete",
        "cascader",
        "colorpicker",
        "mentions",
        "transfer",
        "treeselect",
        "email",
        "phone",
        "url",
        "password",
        "currency",
        "daterange",
        "datetime",
        "multiselect",
        "checkboxgroup",
      ].includes(type)
    ) {
      categories["ADVANCED"].push(component);
    }
    // File & Media - attachment and media fields
    else if (
      ["upload", "imageupload", "dragger", "image", "avatar"].includes(type)
    ) {
      categories["FILE & MEDIA"].push(component);
    }
    // Data lookup - external data sources and data display
    else if (
      [
        "calendar",
        "table",
        "list",
        "tree",
        "descriptions",
        "lookup",
        "reference",
      ].includes(type)
    ) {
      categories["DATA LOOKUP"].push(component);
    }
    // Widget - UI enhancement components and specialized widgets
    else if (
      [
        "slider",
        "rate",
        "badge",
        "carousel",
        "empty",
        "tag",
        "timeline",
        "alert",
        "progress",
        "skeleton",
        "spin",
        "breadcrumb",
        "menu",
        "pagination",
        "steps",
        "divider",
        "space",
        "button",
        "typography",
        "qrcode",
        "barcode",
        "signature",
        "location",
      ].includes(type)
    ) {
      categories["WIDGET"].push(component);
    }
    // Default to BASIC for any unmatched types
    else {
      categories["BASIC"].push(component);
    }
  });

  return categories;
};

const ComponentPaletteSidebar = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized categorized components
  const categorizedComponents = useMemo(() => {
    return categorizeComponents(SIDEBAR_ITEMS);
  }, []);

  // Memoized filtered components based on search term
  const filteredComponents = useMemo(() => {
    if (!searchTerm) return categorizedComponents;

    const filtered = {};
    Object.keys(categorizedComponents).forEach((category) => {
      filtered[category] = categorizedComponents[category].filter(
        (item) =>
          item.component.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.component.type
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (item.component.description &&
            item.component.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    });
    return filtered;
  }, [categorizedComponents, searchTerm]);

  // Clear search when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fb",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Header matching Lowcode design */}
      <div>
        {/* Tab Navigation - Lowcode style */}
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
            background: "#f7fafc",
            borderRadius: "6px",
            padding: "2px",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "6px 0px",
              border: "none",
              background: activeTab === "all" ? "#ffffff" : "transparent",
              color: activeTab === "all" ? "#1a202c" : "#718096",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: activeTab === "all" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow:
                activeTab === "all" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
            onClick={() => handleTabChange("all")}
          >
            All fields
          </button>
          <button
            style={{
              flex: 1,
              padding: "6px 0px",
              border: "none",
              background: activeTab === "suggested" ? "#ffffff" : "transparent",
              color: activeTab === "suggested" ? "#1a202c" : "#718096",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: activeTab === "suggested" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow:
                activeTab === "suggested"
                  ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
            onClick={() => handleTabChange("suggested")}
          >
            Suggested
          </button>
        </div>

        {/* Search Input - Lowcode style */}
        <Input
          placeholder="Search a field type here"
          prefix={
            <SearchOutlined style={{ color: "#718096", fontSize: "14px" }} />
          }
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          onClear={() => setSearchTerm("")}
        />
      </div>

      {/* Components Section - Lowcode spacing */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 0px",
          background: "#f8f9fb",
        }}
      >
        {Object.entries(filteredComponents).map(([category, items]) => {
          // Only render categories that have items
          if (items.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#718096",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: "0 0 8px 0",
                  padding: "0",
                }}
              >
                {category}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {items.map((item, index) => (
                  <SideBarItem
                    key={`${category}-${index}`}
                    component={item.component}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentPaletteSidebar;
