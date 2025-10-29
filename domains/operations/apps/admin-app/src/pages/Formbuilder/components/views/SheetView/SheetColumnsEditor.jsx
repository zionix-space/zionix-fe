import React, { useState } from "react";
import {
  Table,
  Switch,
  Button,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Tooltip,
} from "antd";
import {
  FontSizeOutlined,
  NumberOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SwitcherOutlined,
  DownOutlined,
  UnorderedListOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
  CalculatorOutlined,
  SearchOutlined,
  PaperClipOutlined,
  UserOutlined,
  TagOutlined,
  FileTextOutlined,
  PlusOutlined,
  HolderOutlined,
  StarOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Text } = Typography;
const { Option } = Select;

const ColumnsEditorContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ColumnsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ColumnItem = styled.div`
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-color: #93c5fd;
  }

  &:active {
    cursor: grabbing;
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ColumnControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColumnDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

/**
 * LowCode-Style Sheet Columns Editor
 * Professional column configuration with drag-and-drop reordering
 */
export function SheetColumnsEditor({
  columns,
  onColumnsChange,
  schema,
}) {
  const [draggedColumn, setDraggedColumn] = useState(null);

  const updateColumn = (columnId, updates) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    onColumnsChange(updatedColumns);
  };

  const addColumn = () => {
    const newColumn = {
      id: `col_${Date.now()}`,
      key: `col_${Date.now()}`,
      title: `Column ${columns.length + 1}`,
      type: "text",
      width: 120,
      required: false,
    };
    onColumnsChange([...columns, newColumn]);
  };

  const removeColumn = (columnId) => {
    onColumnsChange(columns.filter((col) => col.id !== columnId));
  };

  const handleDragStart = (columnId) => {
    setDraggedColumn(columnId);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const handleDragOver = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const draggedIndex = columns.findIndex((col) => col.id === draggedColumn);
    const targetIndex = columns.findIndex((col) => col.id === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newColumns = [...columns];
    const [draggedItem] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    onColumnsChange(newColumns);
  };

  const getColumnTypeIcon = (type) => {
    const iconMap = {
      text: FontSizeOutlined,
      number: NumberOutlined,
      currency: DollarOutlined,
      date: CalendarOutlined,
      datetime: ClockCircleOutlined,
      time: ClockCircleOutlined,
      boolean: SwitcherOutlined,
      dropdown: DownOutlined,
      multiselect: UnorderedListOutlined,
      email: MailOutlined,
      phone: PhoneOutlined,
      url: LinkOutlined,
      formula: CalculatorOutlined,
      lookup: SearchOutlined,
      attachment: PaperClipOutlined,
      user: UserOutlined,
      status: TagOutlined,
    };
    const IconComponent = iconMap[type] || FileTextOutlined;
    return <IconComponent style={{ fontSize: 14 }} />;
  };

  const getColumnTypeOptions = () => [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "currency", label: "Currency" },
    { value: "percentage", label: "Percentage" },
    { value: "date", label: "Date" },
    { value: "datetime", label: "Date Time" },
    { value: "time", label: "Time" },
    { value: "boolean", label: "Boolean" },
    { value: "dropdown", label: "Dropdown" },
    { value: "multiselect", label: "Multi-select" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "url", label: "URL" },
    { value: "formula", label: "Formula" },
    { value: "lookup", label: "Lookup" },
    { value: "attachment", label: "Attachment" },
    { value: "user", label: "User" },
    { value: "status", label: "Status" },
  ];

  return (
    <ColumnsEditorContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Column Configuration</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Configure spreadsheet columns with data types and formatting
          </Text>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              {columns.filter((col) => !col.hidden).length} of {columns.length}{" "}
              columns visible
            </Text>
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined style={{ fontSize: 14 }} />}
              onClick={addColumn}
            >
              Add Column
            </Button>
          </div>
        </Space>
      </Card>

      <ColumnsList>
        {columns.map((column) => (
          <ColumnItem
            key={column.id}
            isDragging={draggedColumn === column.id}
            draggable
            onDragStart={() => handleDragStart(column.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, column.id)}
          >
            <ColumnHeader>
              <ColumnTitle>
                <HolderOutlined
                  style={{ fontSize: 14, color: "#9ca3af" }}
                />
                {getColumnTypeIcon(column.type)}
                <Text strong style={{ fontSize: "14px" }}>
                  {column.title}
                </Text>
                {column.required && (
                  <Tooltip title="Required column">
                    <StarOutlined
                      style={{ fontSize: 10, color: "#ef4444" }}
                    />
                  </Tooltip>
                )}
                {column.frozen && (
                  <Tooltip title="Frozen column">
                    <LockOutlined
                      style={{ fontSize: 10, color: "#3b82f6" }}
                    />
                  </Tooltip>
                )}
              </ColumnTitle>

              <ColumnControls>
                <Tooltip title={column.hidden ? "Show column" : "Hide column"}>
                  <Switch
                    size="small"
                    checked={!column.hidden}
                    onChange={(checked) =>
                      updateColumn(column.id, { hidden: !checked })
                    }
                  />
                </Tooltip>

                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                  onClick={() => removeColumn(column.id)}
                  danger
                />
              </ColumnControls>
            </ColumnHeader>

            <ColumnDetails>
              <div>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Column Name
                </Text>
                <Input
                  size="small"
                  value={column.title}
                  onChange={(e) =>
                    updateColumn(column.id, { title: e.target.value })
                  }
                  style={{ marginTop: "2px" }}
                />
              </div>

              <div>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Data Type
                </Text>
                <Select
                  size="small"
                  value={column.type}
                  onChange={(value) =>
                    updateColumn(column.id, { type: value })
                  }
                  style={{ width: "100%", marginTop: "2px" }}
                >
                  {getColumnTypeOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Width (px)
                </Text>
                <Input
                  size="small"
                  type="number"
                  value={column.width}
                  onChange={(e) =>
                    updateColumn(column.id, {
                      width: parseInt(e.target.value) || 120,
                    })
                  }
                  style={{ marginTop: "2px" }}
                />
              </div>

              <div>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Options
                </Text>
                <Space size="small" style={{ marginTop: "2px" }}>
                  <Tooltip title="Required">
                    <Button
                      size="small"
                      type={column.required ? "primary" : "default"}
                      icon={<StarOutlined style={{ fontSize: 10 }} />}
                      onClick={() =>
                        updateColumn(column.id, { required: !column.required })
                      }
                    />
                  </Tooltip>

                  <Tooltip title="Freeze column">
                    <Button
                      size="small"
                      type={column.frozen ? "primary" : "default"}
                      icon={<LockOutlined style={{ fontSize: 10 }} />}
                      onClick={() =>
                        updateColumn(column.id, { frozen: !column.frozen })
                      }
                    />
                  </Tooltip>
                </Space>
              </div>
            </ColumnDetails>

            {(column.type === "dropdown" || column.type === "multiselect") && (
              <div style={{ marginTop: "8px" }}>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Options (comma-separated)
                </Text>
                <Input
                  size="small"
                  value={column.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateColumn(column.id, {
                      options: e.target.value
                        .split(",")
                        .map((opt) => opt.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Option 1, Option 2, Option 3"
                  style={{ marginTop: "2px" }}
                />
              </div>
            )}

            {column.type === "formula" && (
              <div style={{ marginTop: "8px" }}>
                <Text
                  style={{ fontSize: "12px", color: "#4b5563" }}
                >
                  Formula
                </Text>
                <Input
                  size="small"
                  value={column.formula || ""}
                  onChange={(e) =>
                    updateColumn(column.id, { formula: e.target.value })
                  }
                  placeholder="=A1+B1"
                  style={{ marginTop: "2px", fontFamily: "monospace" }}
                />
              </div>
            )}
          </ColumnItem>
        ))}
      </ColumnsList>
    </ColumnsEditorContainer>
  );
}