import React, { useState } from "react";
import {
  Button,
  Select,
  Input,
  Card,
  Space,
  Typography,
  Divider,
  Tag,
  Switch,
} from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Text } = Typography;
const { Option } = Select;

const FiltersEditorContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FilterList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FilterItem = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: #ffffff;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

/**
 * LowCode-Style Gallery Filters Editor
 * Professional filter configuration for gallery views
 */
export function GalleryFiltersEditor({
  filters,
  onFiltersChange,
  schema,
}) {
  const [newFilter, setNewFilter] = useState({
    type: "select",
    visible: true,
    position: "toolbar",
  });

  // Handle both old and new schema formats
  const availableFields = (() => {
    if (schema.sections) {
      // Old format with sections
      return schema.sections.flatMap((section) =>
        (section.fields || []).map((field) => ({
          id: field.id,
          label: field.label,
          type: field.type,
          section: section.title,
        }))
      );
    } else if (schema.components) {
      // New format with components
      return Object.values(schema.components).map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        section: "Form Fields",
      }));
    }
    return [];
  })();

  // Add system fields
  const systemFields = [
    {
      id: "created_at",
      label: "Created Date",
      type: "date",
      section: "System",
    },
    {
      id: "updated_at",
      label: "Updated Date",
      type: "date",
      section: "System",
    },
    { id: "status", label: "Status", type: "status", section: "System" },
  ];

  const allFields = [...availableFields, ...systemFields];

  const addFilter = () => {
    if (!newFilter.field) return;

    const sourceField = allFields.find((f) => f.id === newFilter.field);
    if (!sourceField) return;

    const filter = {
      id: `filter_${Date.now()}`,
      field: newFilter.field,
      type: newFilter.type || mapFieldTypeToFilterType(sourceField.type),
      label: sourceField.label,
      visible: true,
      position: newFilter.position || "toolbar",
      options: generateDefaultOptions(sourceField.type),
    };

    onFiltersChange([...filters, filter]);
    setNewFilter({ type: "select", visible: true, position: "toolbar" });
  };

  const updateFilter = (filterId, updates) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === filterId ? { ...filter, ...updates } : filter
    );
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (filterId) => {
    onFiltersChange(filters.filter((filter) => filter.id !== filterId));
  };

  const mapFieldTypeToFilterType = (fieldType) => {
    const typeMap = {
      text: "search",
      textarea: "search",
      number: "range",
      currency: "range",
      date: "date",
      datetime: "date",
      dropdown: "select",
      multiselect: "multiselect",
      checkbox: "select",
      yesno: "select",
    };
    return typeMap[fieldType] || "select";
  };

  const generateDefaultOptions = (fieldType) => {
    if (fieldType === "dropdown" || fieldType === "multiselect") {
      return [
        { value: "option1", label: "Option 1", count: 5 },
        { value: "option2", label: "Option 2", count: 3 },
        { value: "option3", label: "Option 3", count: 2 },
      ];
    }

    if (fieldType === "status") {
      return [
        { value: "draft", label: "Draft", count: 3, color: "#d9d9d9" },
        {
          value: "in_progress",
          label: "In Progress",
          count: 5,
          color: "#1890ff",
        },
        { value: "review", label: "Review", count: 2, color: "#faad14" },
        { value: "approved", label: "Approved", count: 4, color: "#52c41a" },
      ];
    }

    if (fieldType === "checkbox" || fieldType === "yesno") {
      return [
        { value: true, label: "Yes", count: 7 },
        { value: false, label: "No", count: 3 },
      ];
    }

    return undefined;
  };

  return (
    <FiltersEditorContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Filter Configuration</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Create filters to help users find content in your gallery
          </Text>

          <Divider style={{ margin: "12px 0" }} />

          {/* Add New Filter */}
          <div>
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Add New Filter
            </Text>

            <Space wrap>
              <Select
                placeholder="Select field"
                value={newFilter.field}
                onChange={(value) =>
                  setNewFilter({ ...newFilter, field: value })
                }
                style={{ width: 150 }}
                size="small"
              >
                {allFields.map((field) => (
                  <Option key={field.id} value={field.id}>
                    {field.label}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Filter type"
                value={newFilter.type}
                onChange={(value) =>
                  setNewFilter({ ...newFilter, type: value })
                }
                style={{ width: 120 }}
                size="small"
              >
                <Option value="search">Search</Option>
                <Option value="select">Dropdown</Option>
                <Option value="multiselect">Multi-select</Option>
                <Option value="date">Date</Option>
                <Option value="range">Range</Option>
              </Select>

              <Button
                type="primary"
                size="small"
                icon={<i className="ri-add-line" style={{ fontSize: "14px" }} />}
                onClick={addFilter}
                disabled={!newFilter.field}
              >
                Add Filter
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <FilterList>
        {filters.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "16px" }}>
              <i className="ri-filter-line" style={{ fontSize: "32px", color: "#9ca3af" }} />
              <Text
                type="secondary"
                style={{ display: "block", marginTop: "8px" }}
              >
                No filters configured
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Add filters to help users find content in your gallery
              </Text>
            </div>
          </Card>
        ) : (
          filters.map((filter) => (
            <FilterItem key={filter.id}>
              <FilterHeader>
                <FilterTitle>
                  <i className="ri-filter-line" style={{ fontSize: "14px" }} />
                  <Text strong style={{ fontSize: "14px" }}>
                    {filter.label}
                  </Text>
                </FilterTitle>

                <FilterControls>
                  <Switch
                    size="small"
                    checked={filter.visible}
                    onChange={(checked) =>
                      updateFilter(filter.id, { visible: checked })
                    }
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<i className="ri-delete-bin-line" style={{ fontSize: "12px" }} />}
                    onClick={() => removeFilter(filter.id)}
                    danger
                  />
                </FilterControls>
              </FilterHeader>

              <FilterDetails>
                <div>
                  <Text
                    style={{ fontSize: "12px", color: "#4b5563" }}
                  >
                    Filter Type
                  </Text>
                  <Select
                    size="small"
                    value={filter.type}
                    onChange={(value) =>
                      updateFilter(filter.id, { type: value })
                    }
                    style={{ width: "100%", marginTop: "2px" }}
                  >
                    <Option value="search">Search</Option>
                    <Option value="select">Dropdown</Option>
                    <Option value="multiselect">Multi-select</Option>
                    <Option value="date">Date</Option>
                    <Option value="range">Range</Option>
                  </Select>
                </div>

                <div>
                  <Text
                    style={{ fontSize: "12px", color: "#4b5563" }}
                  >
                    Position
                  </Text>
                  <Select
                    size="small"
                    value={filter.position}
                    onChange={(value) =>
                      updateFilter(filter.id, { position: value })
                    }
                    style={{ width: "100%", marginTop: "2px" }}
                  >
                    <Option value="toolbar">Toolbar</Option>
                    <Option value="sidebar">Sidebar</Option>
                  </Select>
                </div>
              </FilterDetails>

              {filter.options && filter.options.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <Text
                    style={{ fontSize: "12px", color: "#4b5563" }}
                  >
                    Filter Options
                  </Text>
                  <div style={{ marginTop: "4px" }}>
                    <Space wrap>
                      {filter.options.map((option, index) => (
                        <Tag key={index} color={option.color}>
                          {option.label} ({option.count})
                        </Tag>
                      ))}
                    </Space>
                  </div>
                </div>
              )}
            </FilterItem>
          ))
        )}
      </FilterList>
    </FiltersEditorContainer>
  );
}