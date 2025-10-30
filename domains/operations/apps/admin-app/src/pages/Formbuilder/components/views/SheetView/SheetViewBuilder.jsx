import React, { useState, useEffect } from "react";
// import { FormSchema } from "../../../../types/formBuilder"; // Removed problematic import
// import {
//   SheetViewConfig,
//   SheetColumn,
//   SheetRow,
// } from "../../../../types/sheetView"; // Removed problematic import
import { SheetViewPreview } from "./SheetViewPreview";
import { SheetColumnsEditor } from "./SheetColumnsEditor";
import { SheetSettingsEditor } from "./SheetSettingsEditor";
import { Button, Tabs, Card, Space, Typography, Input, Select } from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SheetBuilderContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const SheetBuilderHeader = styled.div`
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SheetBuilderContent = styled.div`
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
 * LowCode-Style Sheet View Builder
 * Excel-like spreadsheet configuration with advanced features
 */
export function SheetViewBuilder({
  schema,
  onSave,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("columns");
  const [sheetConfig, setSheetConfig] = useState({
    id: `sheet_${Date.now()}`,
    name: `${schema.title} Sheet`,
    description: "Spreadsheet view for data entry and analysis",
    formSchemaId: schema.id,
    columns: generateDefaultColumns(schema),
    rows: generateDefaultRows(),
    settings: {
      allowAddRows: true,
      allowDeleteRows: true,
      allowAddColumns: true,
      allowDeleteColumns: true,
      allowReorderRows: true,
      allowReorderColumns: true,
      showRowNumbers: true,
      showColumnHeaders: true,
      showGridLines: true,
      allowFiltering: true,
      allowSorting: true,
      allowGrouping: true,
      enableFormulas: true,
      enableComments: true,
      enableHistory: true,
      autoSave: true,
      autoSaveInterval: 30,
    },
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canImport: true,
      canShare: true,
      canComment: true,
    },
    validation: {
      rules: [],
      showErrorMessages: true,
      preventInvalidData: true,
    },
    formatting: {
      defaultFont: "Arial",
      defaultFontSize: 11,
      alternateRowColors: true,
      headerStyle: {
        backgroundColor: "#f5f5f5",
        fontWeight: "bold",
      },
    },
    calculations: [],
  });

  /**
   * Generate default columns from form schema
   */
  function generateDefaultColumns(schema) {
    const columns = [];

    // Add row number column
    columns.push({
      id: "row_number",
      key: "row_number",
      title: "#",
      type: "number",
      width: 50,
      frozen: true,
      required: false,
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
          type: mapFieldTypeToSheetType(field.type),
          width: getColumnWidth(field.type),
          required: field.required,
          options: field.options,
          defaultValue: field.defaultValue,
        });
      }
    });

    // Add system columns
    columns.push(
      {
        id: "created_at",
        key: "created_at",
        title: "Created",
        type: "datetime",
        width: 150,
        required: false,
      },
      {
        id: "updated_at",
        key: "updated_at",
        title: "Updated",
        type: "datetime",
        width: 150,
        required: false,
      },
      {
        id: "status",
        key: "status",
        title: "Status",
        type: "status",
        width: 100,
        required: false,
        options: ["Draft", "In Progress", "Completed", "Approved"],
      }
    );

    return columns;
  }

  function generateDefaultRows() {
    const rows = [];

    for (let i = 1; i <= 10; i++) {
      rows.push({
        id: `row_${i}`,
        cells: {},
        height: 25,
      });
    }

    return rows;
  }

  function mapFieldTypeToSheetType(fieldType) {
    const typeMap = {
      text: "text",
      textarea: "text",
      number: "number",
      currency: "currency",
      date: "date",
      datetime: "datetime",
      time: "time",
      email: "email",
      phone: "phone",
      url: "url",
      dropdown: "dropdown",
      multiselect: "multiselect",
      checkbox: "boolean",
      yesno: "boolean",
      user: "user",
    };
    return typeMap[fieldType] || "text";
  }

  function getColumnWidth(fieldType) {
    const widthMap = {
      text: 150,
      textarea: 200,
      number: 100,
      currency: 120,
      date: 120,
      datetime: 150,
      email: 200,
      phone: 130,
      dropdown: 120,
      checkbox: 80,
      user: 150,
    };
    return widthMap[fieldType] || 120;
  }

  const handleSave = () => {
    onSave(sheetConfig);
  };

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
        <SheetColumnsEditor
          columns={sheetConfig.columns}
          onColumnsChange={(columns) =>
            setSheetConfig({ ...sheetConfig, columns })
          }
          schema={schema}
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
        <SheetSettingsEditor
          config={sheetConfig}
          onConfigChange={setSheetConfig}
        />
      ),
    },
  ];

  return (
    <SheetBuilderContainer>
      {/* Header */}
      <SheetBuilderHeader>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Sheet View Builder
          </Title>
          <Text type="secondary">
            Create Excel-like spreadsheet views for {schema.title}
          </Text>
        </div>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save Sheet View
          </Button>
        </Space>
      </SheetBuilderHeader>

      {/* Content */}
      <SheetBuilderContent>
        {/* Configuration Panel */}
        <ConfigPanel>
          <div style={{ padding: "16px" }}>
            <Card size="small" style={{ marginBottom: "16px" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Sheet Name</Text>
                  <Input
                    value={sheetConfig.name}
                    onChange={(e) =>
                      setSheetConfig({ ...sheetConfig, name: e.target.value })
                    }
                    style={{ marginTop: "4px" }}
                  />
                </div>

                <div>
                  <Text strong>Description</Text>
                  <TextArea
                    value={sheetConfig.description}
                    onChange={(e) =>
                      setSheetConfig({
                        ...sheetConfig,
                        description: e.target.value,
                      })
                    }
                    style={{ marginTop: "4px" }}
                    rows={3}
                  />
                </div>

                <div>
                  <Text strong>Template</Text>
                  <Select
                    defaultValue="blank"
                    style={{ width: "100%", marginTop: "4px" }}
                  >
                    <Option value="blank">Blank Sheet</Option>
                    <Option value="financial">Financial Template</Option>
                    <Option value="project">Project Tracker</Option>
                    <Option value="inventory">Inventory Management</Option>
                    <Option value="budget">Budget Planner</Option>
                  </Select>
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
              Sheet Preview
            </Title>
            <Text type="secondary">
              Live preview of your spreadsheet configuration
            </Text>
          </div>

          <div style={{ flex: 1, padding: "16px" }}>
            <SheetViewPreview config={sheetConfig} schema={schema} />
          </div>
        </PreviewPanel>
      </SheetBuilderContent>
    </SheetBuilderContainer>
  );
}