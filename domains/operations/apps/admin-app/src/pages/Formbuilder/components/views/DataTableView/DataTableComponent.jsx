import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Space,
  Dropdown,
  Tooltip,
  Popconfirm,
} from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Option } = Select;

const TableContainer = styled.div`
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? "#93c5fd" : "#e5e7eb"};
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.2s ease;

  ${({ isSelected }) =>
    isSelected &&
    `
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    background-color: #eff6ff;
  `}
`;

const TableHeader = styled.div`
  padding: 12px 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableContent = styled.div`
  padding: 16px;
  min-height: 200px;
  max-height: 400px;
  overflow: auto;
`;

const ActionButton = styled(Button)`
  font-size: 12px;
  height: 24px;
  padding: 0 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const FieldTypeBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 6px;
  background-color: #2563eb;
  color: white;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export function DataTableComponent({
  field,
  isSelected,
  onFieldUpdate,
  onFieldDelete,
  onChange,
}) {
  const [data, setData] = useState(field.rows || []);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        setData(newData);
        setEditingKey("");
        onChange(newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.id !== key);
    setData(newData);
    onChange(newData);
  };

  const handleAdd = () => {
    const newRow = {
      id: `row_${Date.now()}`,
      cells: {},
      isNew: true,
    };

    // Initialize cells with default values
    field.columns?.forEach((column) => {
      newRow.cells[column.id] = column.defaultValue || "";
    });

    const newData = [...data, newRow];
    setData(newData);
    onChange(newData);
    setEditingKey(newRow.id);
  };

  const handleCellChange = (value, rowId, columnId) => {
    const newData = [...data];
    const rowIndex = newData.findIndex((item) => item.id === rowId);
    if (rowIndex > -1) {
      newData[rowIndex].cells[columnId] = value;
      newData[rowIndex].isModified = true;
      setData(newData);
    }
  };

  const renderCell = (column, record, editing) => {
    const value = record.cells[column.id];

    if (!editing) {
      return <span>{value}</span>;
    }

    switch (column.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <Input
            value={value}
            onChange={(e) =>
              handleCellChange(e.target.value, record.id, column.id)
            }
            placeholder={column.label}
          />
        );
      case "number":
      case "currency":
        return (
          <InputNumber
            value={value}
            onChange={(val) => handleCellChange(val, record.id, column.id)}
            style={{ width: "100%" }}
            min={column.validation?.min}
            max={column.validation?.max}
          />
        );
      case "date":
        return (
          <DatePicker
            value={value}
            onChange={(date) => handleCellChange(date, record.id, column.id)}
            style={{ width: "100%" }}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value}
            onChange={(val) => handleCellChange(val, record.id, column.id)}
            style={{ width: "100%" }}
          >
            {column.options?.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      case "checkbox":
        return (
          <Checkbox
            checked={value}
            onChange={(e) =>
              handleCellChange(e.target.checked, record.id, column.id)
            }
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) =>
              handleCellChange(e.target.value, record.id, column.id)
            }
            placeholder={column.label}
          />
        );
    }
  };

  const columns = [
    ...(field.columns?.map((column) => ({
      title: column.label,
      dataIndex: column.id,
      key: column.id,
      width: column.width || 150,
      render: (_, record) => {
        const editing = isEditing(record);
        return renderCell(column, record, editing);
      },
    })) || []),
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => save(record.id)}
              icon={<i className="ri-check-line"></i>}
            >
              Save
            </Button>
            <Button
              type="link"
              size="small"
              onClick={cancel}
              icon={<i className="ri-close-line"></i>}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Tooltip title="Edit row">
              <Button
                type="link"
                size="small"
                onClick={() => edit(record)}
                icon={<i className="ri-edit-line"></i>}
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this row?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete row">
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<i className="ri-delete-bin-line"></i>}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const menuItems = [
    {
      key: "add-column",
      label: "Add Column",
      icon: <i className="ri-add-line"></i>,
    },
    {
      key: "import",
      label: "Import Data",
      icon: <i className="ri-upload-line"></i>,
    },
    {
      key: "export",
      label: "Export Data",
      icon: <i className="ri-download-line"></i>,
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <TableContainer isSelected={isSelected}>
        <TableHeader>
          <TableTitle>
            <i className="ri-table-line"></i>
            {field.label}
          </TableTitle>

          <TableActions>
            <ActionButton
              type="primary"
              size="small"
              onClick={handleAdd}
              icon={<PlusOutlined />}
            >
              Add Row
            </ActionButton>

            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  console.log(`Clicked ${key}`);
                },
              }}
              trigger={["click"]}
            >
              <ActionButton
                size="small"
                icon={<i className="ri-more-line"></i>}
              />
            </Dropdown>

            {onFieldDelete && (
              <Popconfirm
                title="Are you sure you want to delete this table?"
                onConfirm={onFieldDelete}
                okText="Yes"
                cancelText="No"
              >
                <ActionButton
                  size="small"
                  danger
                  icon={<i className="ri-delete-bin-line"></i>}
                />
              </Popconfirm>
            )}
          </TableActions>
        </TableHeader>

        <TableContent>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: "max-content" }}
            rowClassName={(record) => {
              if (record.isNew) return "table-row-new";
              if (record.isModified) return "table-row-modified";
              return "";
            }}
          />
        </TableContent>
      </TableContainer>

      {isSelected && <FieldTypeBadge>Data Table</FieldTypeBadge>}
    </div>
  );
}