import React, { useState } from "react";
import {
  Button,
  Select,
  Input,
  Switch,
  Card,
  Space,
  Typography,
  Divider,
  ColorPicker,
} from "antd";
import {
  FontSizeOutlined,
  AlignLeftOutlined,
  PictureOutlined,
  UserOutlined,
  TagOutlined,
  CalendarOutlined,
  StarOutlined,
  TagsOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  MenuOutlined,
  DeleteOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// // import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Text } = Typography;
const { Option } = Select;

const TemplateEditorContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FieldList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FieldItem = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: #ffffff;
  cursor: grab;
  transition: all 0.2s ease;

  ${({ isDragging }) =>
    isDragging &&
    `
    opacity: 0.5;
    transform: rotate(2deg);
  `}

  &:hover {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border-color: #93c5fd;
  }

  &:active {
    cursor: grabbing;
  }
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FieldTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const FieldControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FieldDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

/**
 * LowCode-Style Card Template Editor
 * Professional card design configuration with drag-and-drop field arrangement
 */
export function CardTemplateEditor({
  template,
  onTemplateChange,
  schema,
}) {
  const [draggedField, setDraggedField] = useState(null);

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
    { id: "author", label: "Author", type: "user", section: "System" },
  ];

  const allFields = [...availableFields, ...systemFields];

  const updateTemplate = (updates) => {
    onTemplateChange({ ...template, ...updates });
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = template.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    updateTemplate({ fields: updatedFields });
  };

  const addField = (sourceFieldId) => {
    const sourceField = allFields.find((f) => f.id === sourceFieldId);
    if (!sourceField) return;

    const newField = {
      id: `card_${sourceFieldId}_${Date.now()}`,
      fieldId: sourceFieldId,
      label: sourceField.label,
      type: mapFieldTypeToCardType(sourceField.type),
      position: { area: "body", order: template.fields.length + 1 },
      styling: getDefaultStyling(mapFieldTypeToCardType(sourceField.type)),
      visible: true,
    };

    updateTemplate({ fields: [...template.fields, newField] });
  };

  const removeField = (fieldId) => {
    const updatedFields = template.fields.filter(
      (field) => field.id !== fieldId
    );
    updateTemplate({ fields: updatedFields });
  };

  const mapFieldTypeToCardType = (fieldType) => {
    const typeMap = {
      text: "title",
      textarea: "description",
      image: "image",
      user: "avatar",
      dropdown: "status",
      date: "date",
      rating: "rating",
      multiselect: "tags",
      number: "metadata",
      currency: "metadata",
    };
    return typeMap[fieldType] || "metadata";
  };

  const getDefaultStyling = (cardType) => {
    const stylingMap = {
      title: {
        fontSize: "16px",
        fontWeight: "600",
        alignment: "left",
        truncate: true,
        maxLines: 2,
      },
      subtitle: {
        fontSize: "14px",
        fontWeight: "500",
        alignment: "left",
        color: "#4b5563",
      },
      description: {
        fontSize: "14px",
        alignment: "left",
        color: "#4b5563",
        truncate: true,
        maxLines: 3,
      },
      metadata: {
        fontSize: "12px",
        alignment: "left",
        color: "#6b7280",
      },
      date: {
        fontSize: "12px",
        alignment: "right",
        color: "#6b7280",
      },
      status: { alignment: "left" },
      rating: { alignment: "left" },
      tags: { alignment: "left" },
      image: { alignment: "center" },
      avatar: { alignment: "left" },
    };
    return stylingMap[cardType] || { alignment: "left" };
  };

  const getFieldIcon = (fieldType) => {
    const iconMap = {
      title: FontSizeOutlined,
      subtitle: FontSizeOutlined,
      description: AlignLeftOutlined,
      image: PictureOutlined,
      avatar: UserOutlined,
      status: TagOutlined,
      date: CalendarOutlined,
      rating: StarOutlined,
      tags: TagsOutlined,
      metadata: InfoCircleOutlined,
    };
    const IconComponent = iconMap[fieldType] || FileTextOutlined;
    return <IconComponent />;
  };

  const handleDragStart = (fieldId) => {
    setDraggedField(fieldId);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
  };

  const handleDragOver = (e, targetFieldId) => {
    e.preventDefault();
    if (!draggedField || draggedField === targetFieldId) return;

    const draggedIndex = template.fields.findIndex(
      (f) => f.id === draggedField
    );
    const targetIndex = template.fields.findIndex(
      (f) => f.id === targetFieldId
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newFields = [...template.fields];
    const [draggedItem] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedItem);

    updateTemplate({ fields: newFields });
  };

  return (
    <TemplateEditorContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Card Template Settings</Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <div>
              <Text style={{ fontSize: "12px", color: "#4b5563" }}>
                Card Width
              </Text>
              <Input
                type="number"
                value={template.width}
                onChange={(e) =>
                  updateTemplate({ width: parseInt(e.target.value) || 300 })
                }
                suffix="px"
                style={{ marginTop: "2px" }}
                size="small"
              />
            </div>

            <div>
              <Text style={{ fontSize: "12px", color: "#4b5563" }}>
                Card Height
              </Text>
              <Input
                type="number"
                value={template.height}
                onChange={(e) =>
                  updateTemplate({ height: parseInt(e.target.value) || 400 })
                }
                suffix="px"
                style={{ marginTop: "2px" }}
                size="small"
              />
            </div>
          </div>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Background Color
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "2px",
              }}
            >
              <ColorPicker
                value={template.styling.backgroundColor}
                onChange={(color) =>
                  updateTemplate({
                    styling: {
                      ...template.styling,
                      backgroundColor: color.toHexString(),
                    },
                  })
                }
                size="small"
              />
              <Input
                value={template.styling.backgroundColor}
                onChange={(e) =>
                  updateTemplate({
                    styling: {
                      ...template.styling,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                size="small"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Hover Effect
            </Text>
            <Switch
              size="small"
              checked={template.styling.hoverEffect}
              onChange={(checked) =>
                updateTemplate({
                  styling: { ...template.styling, hoverEffect: checked },
                })
              }
            />
          </div>
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Add Fields</Text>
          <Select
            placeholder="Select field to add"
            style={{ width: "100%" }}
            onSelect={addField}
            value={undefined}
          >
            {allFields.map((field) => (
              <Option key={field.id} value={field.id}>
                {field.label} ({field.section})
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      <FieldList>
        <Text
          strong
          style={{ marginBottom: "8px", display: "block" }}
        >
          Card Fields ({template.fields.length})
        </Text>

        {template.fields.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "16px" }}>
              <LayoutOutlined style={{ fontSize: "32px", color: "#9ca3af" }} />
              <Text
                type="secondary"
                style={{ display: "block", marginTop: "8px" }}
              >
                No fields configured
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Add fields to design your card template
              </Text>
            </div>
          </Card>
        ) : (
          template.fields.map((field) => (
            <FieldItem
              key={field.id}
              isDragging={draggedField === field.id}
              draggable
              onDragStart={() => handleDragStart(field.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, field.id)}
            >
              <FieldHeader>
                <FieldTitle>
                  <MenuOutlined style={{ color: "#9ca3af" }} />
                  {getFieldIcon(field.type)}
                  <Text strong style={{ fontSize: "14px" }}>
                    {field.label}
                  </Text>
                </FieldTitle>

                <FieldControls>
                  <Switch
                    size="small"
                    checked={field.visible}
                    onChange={(checked) =>
                      updateField(field.id, { visible: checked })
                    }
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeField(field.id)}
                    danger
                  />
                </FieldControls>
              </FieldHeader>

              {field.visible && (
                <FieldDetails>
                  <div>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                      }}
                    >
                      Type
                    </Text>
                    <Select
                      size="small"
                      value={field.type}
                      onChange={(value) =>
                        updateField(field.id, { type: value })
                      }
                      style={{ width: "100%", marginTop: "2px" }}
                    >
                      <Option value="title">Title</Option>
                      <Option value="subtitle">Subtitle</Option>
                      <Option value="description">Description</Option>
                      <Option value="image">Image</Option>
                      <Option value="avatar">Avatar</Option>
                      <Option value="status">Status</Option>
                      <Option value="date">Date</Option>
                      <Option value="rating">Rating</Option>
                      <Option value="tags">Tags</Option>
                      <Option value="metadata">Metadata</Option>
                    </Select>
                  </div>

                  <div>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                      }}
                    >
                      Area
                    </Text>
                    <Select
                      size="small"
                      value={field.position.area}
                      onChange={(value) =>
                        updateField(field.id, {
                          position: { ...field.position, area: value },
                        })
                      }
                      style={{ width: "100%", marginTop: "2px" }}
                    >
                      <Option value="header">Header</Option>
                      <Option value="body">Body</Option>
                      <Option value="footer">Footer</Option>
                    </Select>
                  </div>

                  <div>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                      }}
                    >
                      Font Size
                    </Text>
                    <Input
                      size="small"
                      value={field.styling.fontSize || "14px"}
                      onChange={(e) =>
                        updateField(field.id, {
                          styling: {
                            ...field.styling,
                            fontSize: e.target.value,
                          },
                        })
                      }
                      style={{ marginTop: "2px" }}
                    />
                  </div>

                  <div>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                      }}
                    >
                      Alignment
                    </Text>
                    <Select
                      size="small"
                      value={field.styling.alignment}
                      onChange={(value) =>
                        updateField(field.id, {
                          styling: {
                            ...field.styling,
                            alignment: value,
                          },
                        })
                      }
                      style={{ width: "100%", marginTop: "2px" }}
                    >
                      <Option value="left">Left</Option>
                      <Option value="center">Center</Option>
                      <Option value="right">Right</Option>
                    </Select>
                  </div>
                </FieldDetails>
              )}
            </FieldItem>
          ))
        )}
      </FieldList>
    </TemplateEditorContainer>
  );
}