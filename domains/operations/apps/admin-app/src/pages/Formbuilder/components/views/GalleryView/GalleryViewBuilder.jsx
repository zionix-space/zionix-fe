import React, { useState, useEffect } from "react";
// import { FormSchema } from "../../../../types/formBuilder"; // Removed problematic import
// import {
//   GalleryViewConfig,
//   CardTemplate,
//   GalleryLayout,
// } from "../../../../types/galleryView"; // Removed problematic import
import { GalleryPreview } from "./GalleryPreview";
import { CardTemplateEditor } from "./CardTemplateEditor";
import { GalleryLayoutEditor } from "./GalleryLayoutEditor";
import { GalleryFiltersEditor } from "./GalleryFiltersEditor";
import { Button, Tabs, Card, Space, Typography, Input, Select } from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const GalleryBuilderContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
`;

const GalleryBuilderHeader = styled.div`
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GalleryBuilderContent = styled.div`
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
 * LowCode-Style Gallery View Builder
 * Professional visual data presentation with card-based layouts
 */
export function GalleryViewBuilder({ schema, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("template");
  const [galleryConfig, setGalleryConfig] = useState({
    id: `gallery_${Date.now()}`,
    name: `${schema.title} Gallery`,
    description: "Visual gallery view of form submissions",
    formSchemaId: schema.id,
    cardTemplate: generateDefaultCardTemplate(schema),
    layout: {
      type: "masonry",
      columns: 3,
      gap: "md",
      responsive: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      aspectRatio: "auto",
    },
    filters: [],
    sorting: [
      { field: "created_at", direction: "desc", label: "Newest First" },
      { field: "updated_at", direction: "desc", label: "Recently Updated" },
    ],
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canShare: true,
    },
    settings: {
      showSearch: true,
      showFilters: true,
      showSorting: true,
      showGrouping: false,
      enableInfiniteScroll: true,
      cardsPerPage: 24,
      showCardCount: true,
      enableFullscreen: true,
      enableSlideshow: false,
      autoRefresh: false,
      refreshInterval: 30,
    },
  });

  /**
   * Generate default card template from form schema
   */
  function generateDefaultCardTemplate(schema) {
    // Handle both old and new schema formats
    let fields = [];
    
    if (schema.sections) {
      // Old format with sections
      fields = schema.sections.flatMap((section) => section.fields || []);
    } else if (schema.components) {
      // New format with components
      fields = Object.values(schema.components);
    }
    
    const cardFields = [];

    // Find image field for card header
    const imageField = fields.find((f) => f && f.type === "image");
    if (imageField) {
      cardFields.push({
        id: `card_${imageField.id}`,
        fieldId: imageField.id,
        label: imageField.label,
        type: "image",
        position: { area: "header", order: 1 },
        styling: { alignment: "center" },
        visible: true,
      });
    }

    // Find title field (first text field or input field)
    const titleField = fields.find((f) => f && (f.type === "text" || f.type === "input"));
    if (titleField) {
      cardFields.push({
        id: `card_${titleField.id}`,
        fieldId: titleField.id,
        label: titleField.label,
        type: "title",
        position: { area: "body", order: 1 },
        styling: {
          fontSize: "16px",
          fontWeight: "600",
          alignment: "left",
          truncate: true,
          maxLines: 2,
        },
        visible: true,
      });
    }

    // Find description field (textarea)
    const descField = fields.find((f) => f && f.type === "textarea");
    if (descField) {
      cardFields.push({
        id: `card_${descField.id}`,
        fieldId: descField.id,
        label: descField.label,
        type: "description",
        position: { area: "body", order: 2 },
        styling: {
          fontSize: "14px",
          color: "#4b5563",
          alignment: "left",
          truncate: true,
          maxLines: 3,
        },
        visible: true,
      });
    }

    // Find status field
    const statusField = fields.find(
      (f) => f && (f.type === "dropdown" || f.type === "select") && f.label && f.label.toLowerCase().includes("status")
    );
    if (statusField) {
      cardFields.push({
        id: `card_${statusField.id}`,
        fieldId: statusField.id,
        label: statusField.label,
        type: "status",
        position: { area: "footer", order: 1 },
        styling: { alignment: "left" },
        visible: true,
      });
    }

    // Add created date
    cardFields.push({
      id: "card_created_at",
      fieldId: "created_at",
      label: "Created",
      type: "date",
      position: { area: "footer", order: 2 },
      styling: {
        fontSize: "12px",
        color: "#6b7280",
        alignment: "right",
      },
      visible: true,
    });

    return {
      id: "default_template",
      name: "Default Card",
      type: "standard",
      width: 300,
      height: 400,
      fields: cardFields,
      styling: {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderRadius: "8px",
        shadow: "sm",
        padding: "16px",
        hoverEffect: true,
      },
      actions: [
        {
          id: "view",
          label: "View",
          icon: "Eye",
          type: "view",
          position: "overlay",
        },
        {
          id: "edit",
          label: "Edit",
          icon: "Edit",
          type: "edit",
          position: "overlay",
        },
      ],
    };
  }

  const handleSave = () => {
    onSave(galleryConfig);
  };

  const tabItems = [
    {
      key: "template",
      label: (
        <Space>
          <i className="ri-layout-line" />
          Card Template
        </Space>
      ),
      children: (
        <CardTemplateEditor
          template={galleryConfig.cardTemplate}
          onTemplateChange={(template) =>
            setGalleryConfig({ ...galleryConfig, cardTemplate: template })
          }
          schema={schema}
        />
      ),
    },
    {
      key: "layout",
      label: (
        <Space>
          <i className="ri-apps-line" />
          Layout
        </Space>
      ),
      children: (
        <GalleryLayoutEditor
          layout={galleryConfig.layout}
          onLayoutChange={(layout) =>
            setGalleryConfig({ ...galleryConfig, layout })
          }
        />
      ),
    },
    {
      key: "filters",
      label: (
        <Space>
          <i className="ri-filter-line" />
          Filters
        </Space>
      ),
      children: (
        <GalleryFiltersEditor
          filters={galleryConfig.filters}
          onFiltersChange={(filters) =>
            setGalleryConfig({ ...galleryConfig, filters })
          }
          schema={schema}
        />
      ),
    },
  ];

  return (
    <GalleryBuilderContainer>
      {/* Header */}
      <GalleryBuilderHeader>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Gallery View Builder
          </Title>
          <Text type="secondary">
            Create visual card-based views for {schema.title}
          </Text>
        </div>

        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save Gallery View
          </Button>
        </Space>
      </GalleryBuilderHeader>

      {/* Content */}
      <GalleryBuilderContent>
        {/* Configuration Panel */}
        <ConfigPanel>
          <div style={{ padding: "16px" }}>
            <Card size="small" style={{ marginBottom: "16px" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Gallery Name</Text>
                  <Input
                    value={galleryConfig.name}
                    onChange={(e) =>
                      setGalleryConfig({
                        ...galleryConfig,
                        name: e.target.value,
                      })
                    }
                    style={{ marginTop: "4px" }}
                  />
                </div>

                <div>
                  <Text strong>Description</Text>
                  <TextArea
                    value={galleryConfig.description}
                    onChange={(e) =>
                      setGalleryConfig({
                        ...galleryConfig,
                        description: e.target.value,
                      })
                    }
                    style={{ marginTop: "4px" }}
                    rows={3}
                  />
                </div>

                <div>
                  <Text strong>Template Style</Text>
                  <Select
                    value={galleryConfig.cardTemplate.type}
                    onChange={(value) =>
                      setGalleryConfig({
                        ...galleryConfig,
                        cardTemplate: {
                          ...galleryConfig.cardTemplate,
                          type: value,
                        },
                      })
                    }
                    style={{ width: "100%", marginTop: "4px" }}
                  >
                    <Option value="compact">Compact Cards</Option>
                    <Option value="standard">Standard Cards</Option>
                    <Option value="detailed">Detailed Cards</Option>
                    <Option value="custom">Custom Layout</Option>
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
              Gallery Preview
            </Title>
            <Text type="secondary">
              Live preview of your gallery view configuration
            </Text>
          </div>

          <div style={{ flex: 1, padding: "16px" }}>
            <GalleryPreview config={galleryConfig} schema={schema} />
          </div>
        </PreviewPanel>
      </GalleryBuilderContent>
    </GalleryBuilderContainer>
  );
}