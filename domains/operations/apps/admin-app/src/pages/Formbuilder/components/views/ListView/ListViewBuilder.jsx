import React, { useState, useCallback } from "react";
import { ListViewPreview } from "./ListViewPreview";
import { ListViewSettings } from "./ListViewSettings";
import { ColumnManager } from "./ColumnManager";
import { FilterBuilder } from "./FilterBuilder";
import { Button, Tabs, Card, Space, Typography, Divider } from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Title, Text } = Typography;

const ListBuilderContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const ListBuilderHeader = styled.div`
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ListBuilderContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const ConfigPanel = styled.div`
  width: 400px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
`;

const PreviewPanel = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/**
 * LowCode-Style List View Builder
 * Professional data management interface with advanced filtering and column management
 */
export function ListViewBuilder({
  schema,
  onSave,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("columns");
  const [listConfig, setListConfig] = useState({
    id: `list_${Date.now()}`,
    name: `${schema.title} List`,
    description: "Manage and view form submissions",
    formSchemaId: schema.id,
    columns: generateDefaultColumns(schema),
    filters: [],
    sorting: [],
    pagination: {
      pageSize: 25,
      showSizeChanger: true,
      showQuickJumper: true,
    },
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
    },
    settings: {
      showRowNumbers: true,
      allowBulkActions: true,
      enableSearch: true,
      autoRefresh: false,
      refreshInterval: 30,
    },
  });

  /**
   * Generate default columns from form schema
   * Creates intelligent column configuration based on field types
   */
  function generateDefaultColumns(schema) {
    const columns = [];

    // Add system columns
    columns.push({
      id: "id",
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 80,
      fixed: "left",
      sortable: true,
      filterable: false,
      visible: true,
      type: "text",
    });

    // Add form field columns
    const fields = schema.sections 
      ? schema.sections.flatMap(section => section.fields || [])
      : schema.components ? Object.values(schema.components) : [];
    
    fields.forEach((field) => {
      if (field && field.id && field.type) {
        columns.push({
          id: field.id,
          key: field.id,
          title: field.label || field.name,
          dataIndex: field.id,
          width: getColumnWidth(field.type),
          sortable: isSortableField(field.type),
          filterable: isFilterableField(field.type),
          visible: isDefaultVisible(field.type),
          type: mapFieldTypeToColumnType(field.type),
          fieldType: field.type,
          required: field.required,
        });
      }
    });

    // Add system tracking columns
    columns.push(
      {
        id: "created_at",
        key: "created_at",
        title: "Created",
        dataIndex: "created_at",
        width: 150,
        sortable: true,
        filterable: true,
        visible: true,
        type: "datetime",
      },
      {
        id: "updated_at",
        key: "updated_at",
        title: "Updated",
        dataIndex: "updated_at",
        width: 150,
        sortable: true,
        filterable: true,
        visible: false,
        type: "datetime",
      },
      {
        id: "status",
        key: "status",
        title: "Status",
        dataIndex: "status",
        width: 100,
        sortable: true,
        filterable: true,
        visible: true,
        type: "status",
      }
    );

    return columns;
  }

  function getColumnWidth(fieldType) {
    const widthMap = {
      text: 200,
      textarea: 300,
      number: 120,
      currency: 150,
      date: 150,
      datetime: 180,
      email: 250,
      phone: 150,
      dropdown: 150,
      checkbox: 100,
      rating: 120,
      file: 200,
      user: 180,
      department: 150,
    };
    return widthMap[fieldType] || 150;
  }

  function isSortableField(fieldType) {
    return !["file", "image", "signature", "table"].includes(fieldType);
  }

  function isFilterableField(fieldType) {
    return !["file", "image", "signature", "table"].includes(fieldType);
  }

  function isDefaultVisible(fieldType) {
    return !["password", "signature"].includes(fieldType);
  }

  function mapFieldTypeToColumnType(fieldType) {
    const typeMap = {
      text: "text",
      textarea: "text",
      number: "number",
      currency: "currency",
      date: "date",
      datetime: "datetime",
      email: "email",
      phone: "phone",
      dropdown: "select",
      multiselect: "tags",
      checkbox: "boolean",
      yesno: "boolean",
      rating: "rating",
      file: "file",
      image: "image",
      user: "user",
      department: "department",
    };
    return typeMap[fieldType] || "text";
  }

  const handleSave = () => {
    onSave(listConfig);
  };

  const handleColumnsChange = useCallback((columns) => {
    setListConfig(prev => ({ ...prev, columns }));
  }, []);

  const handleFiltersChange = useCallback((filters) => {
    setListConfig(prev => ({ ...prev, filters }));
  }, []);

  const tabItems = [
    {
      key: "columns",
      label: (
        <Space>
          <i className="ri-table-line" style={{ fontSize: 16 }} />
          Columns
        </Space>
      ),
      children: (
        <ColumnManager
          columns={listConfig.columns}
          onColumnsChange={handleColumnsChange}
          schema={schema}
        />
      ),
    },
    {
      key: "filters",
      label: (
        <Space>
          <i className="ri-filter-line" style={{ fontSize: 16 }} />
          Filters
        </Space>
      ),
      children: (
        <FilterBuilder
          filters={listConfig.filters}
          onFiltersChange={handleFiltersChange}
          columns={listConfig.columns}
        />
      ),
    },
    {
      key: "settings",
      label: (
        <Space>
          <i className="ri-settings-line" style={{ fontSize: 16 }} />
          Settings
        </Space>
      ),
      children: (
        <ListViewSettings config={listConfig} onConfigChange={setListConfig} />
      ),
    },
  ];

  return (
    <ListBuilderContainer>
      {/* Header */}
      <ListBuilderHeader>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            List View Builder
          </Title>
          <Text type="secondary">
            Create and configure data views for {schema.title}
          </Text>
        </div>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save List View
          </Button>
        </Space>
      </ListBuilderHeader>

      {/* Content */}
      <ListBuilderContent>
        {/* Configuration Panel */}
        <ConfigPanel>
          <div style={{ padding: "16px" }}>
            <Card size="small" style={{ marginBottom: "16px" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>List Name</Text>
                  <input
                    type="text"
                    value={listConfig.name}
                    onChange={(e) =>
                      setListConfig({ ...listConfig, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      marginTop: "4px",
                    }}
                  />
                </div>

                <div>
                  <Text strong>Description</Text>
                  <textarea
                    value={listConfig.description}
                    onChange={(e) =>
                      setListConfig({
                        ...listConfig,
                        description: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      marginTop: "4px",
                      height: "60px",
                      resize: "none",
                    }}
                  />
                </div>
              </Space>
            </Card>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="small"
            />
          </div>
        </ConfigPanel>

        {/* Preview Panel */}
        <PreviewPanel>
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Preview
            </Title>
            <Text type="secondary">
              Live preview of your list view configuration
            </Text>
          </div>

          <div style={{ flex: 1, padding: "16px" }}>
            <ListViewPreview config={listConfig} schema={schema} />
          </div>
        </PreviewPanel>
      </ListBuilderContent>
    </ListBuilderContainer>
  );
}