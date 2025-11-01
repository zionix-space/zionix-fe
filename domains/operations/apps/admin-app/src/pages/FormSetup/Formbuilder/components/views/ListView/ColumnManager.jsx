import React, { useState, useCallback, useRef } from "react";
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
  Modal,
  Form,
  message,
  Tabs,
  Checkbox,
  Divider,
  Tag,
  ColorPicker,
  InputNumber,
  Radio,
} from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Text } = Typography;
const { Option } = Select;

const ColumnManagerContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ColumnList = styled.div`
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
 * Debounced Width Input Field Component
 * Prevents infinite re-renders during rapid typing
 */
function WidthInputField({ column, updateColumn }) {
  const [localValue, setLocalValue] = useState(column.width);
  const timeoutRef = useRef(null);

  // Update local value when column width changes externally
  React.useEffect(() => {
    setLocalValue(column.width);
  }, [column.width]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only update parent state after user stops typing for 300ms
    timeoutRef.current = setTimeout(() => {
      if (value === '' || value === null || value === undefined) {
        return;
      }
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue !== column.width) {
        updateColumn(column.id, { width: numValue });
      }
    }, 300);
  };

  const handleBlur = (e) => {
    // Clear timeout on blur
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const value = e.target.value;
    if (value === '' || value === null || value === undefined) {
      updateColumn(column.id, { width: 150 });
      setLocalValue(150);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue !== column.width) {
        updateColumn(column.id, { width: numValue });
      }
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <Text style={{ fontSize: "12px", color: "#4b5563" }}>
        Width
      </Text>
      <Input
        size="small"
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        suffix="px"
        style={{ marginTop: "2px" }}
      />
    </div>
  );
}

/**
 * LowCode-Style Column Manager
 * Professional column configuration with drag-and-drop reordering
 */
export function ColumnManager({
  columns,
  onColumnsChange,
  schema,
}) {
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [isAddColumnModalVisible, setIsAddColumnModalVisible] = useState(false);
  const [form] = Form.useForm();

  const updateColumn = useCallback((columnId, updates) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, ...updates } : col
    );
    onColumnsChange(updatedColumns);
  }, [columns, onColumnsChange]);

  const toggleColumnVisibility = useCallback((columnId) => {
    updateColumn(columnId, {
      visible: !columns.find((col) => col.id === columnId)?.visible,
    });
  }, [updateColumn, columns]);

  const addNewColumn = useCallback((columnData) => {
    const newColumn = {
      id: `custom_${Date.now()}`,
      key: `custom_${Date.now()}`,
      title: columnData.title,
      dataIndex: columnData.dataIndex || columnData.title.toLowerCase().replace(/\s+/g, '_'),
      width: columnData.width || 150,
      type: columnData.type,
      sortable: columnData.sortable || false,
      filterable: columnData.filterable || false,
      visible: true,
      fixed: columnData.fixed || undefined,
      isCustom: true,
      // Advanced Role-Based Access Control
      permissions: {
        view: columnData.permissions?.view || ['admin', 'user', 'viewer'],
        edit: columnData.permissions?.edit || ['admin'],
        export: columnData.permissions?.export || ['admin', 'user'],
        filter: columnData.permissions?.filter || ['admin', 'user'],
        sort: columnData.permissions?.sort || ['admin', 'user', 'viewer']
      },
      // Advanced Customization Options
      customization: {
        conditionalFormatting: columnData.customization?.conditionalFormatting || [],
        validation: columnData.customization?.validation || null,
        transform: columnData.customization?.transform || null,
        aggregation: columnData.customization?.aggregation || null,
        tooltip: columnData.customization?.tooltip || null,
        clickAction: columnData.customization?.clickAction || null,
        contextMenu: columnData.customization?.contextMenu || []
      },
      // Data Security & Privacy
      security: {
        encrypted: columnData.security?.encrypted || false,
        masked: columnData.security?.masked || false,
        auditLog: columnData.security?.auditLog || false,
        piiData: columnData.security?.piiData || false
      }
    };
    
    const updatedColumns = [...columns, newColumn];
    onColumnsChange(updatedColumns);
    message.success('Column added successfully');
  }, [columns, onColumnsChange]);

  const deleteColumn = useCallback((columnId) => {
    const column = columns.find(col => col.id === columnId);
    if (column && !column.isCustom) {
      message.warning('Cannot delete system columns');
      return;
    }
    
    const updatedColumns = columns.filter(col => col.id !== columnId);
    onColumnsChange(updatedColumns);
    message.success('Column deleted successfully');
  }, [columns, onColumnsChange]);

  const handleAddColumn = () => {
    form.validateFields().then((values) => {
      addNewColumn(values);
      setIsAddColumnModalVisible(false);
      form.resetFields();
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
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

  const getFieldIcon = (fieldType) => {
    const iconMap = {
      text: "ri-font-size",
      number: "ri-hashtag",
      currency: "ri-money-dollar-circle-line",
      date: "ri-calendar-line",
      datetime: "ri-calendar-event-line",
      email: "ri-mail-line",
      phone: "ri-phone-line",
      dropdown: "ri-arrow-down-s-line",
      checkbox: "ri-checkbox-line",
      user: "ri-user-line",
      department: "ri-building-line",
      rating: "ri-star-line",
      file: "ri-file-line",
      image: "ri-image-line",
    };
    const iconClass = iconMap[fieldType] || "ri-file-text-line";
    return <i className={iconClass} style={{ fontSize: 14 }} />;
  };

  const getColumnTypeOptions = () => [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "currency", label: "Currency" },
    { value: "date", label: "Date" },
    { value: "datetime", label: "Date Time" },
    { value: "boolean", label: "Boolean" },
    { value: "status", label: "Status" },
    { value: "rating", label: "Rating" },
    { value: "user", label: "User" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "file", label: "File" },
    { value: "image", label: "Image" },
    { value: "tags", label: "Tags" },
  ];

  return (
    <ColumnManagerContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Column Configuration</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Drag to reorder, toggle visibility, and configure column properties
          </Text>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "12px" }}>
              {columns.filter((col) => col.visible).length} of {columns.length}{" "}
              columns visible
            </Text>
            <Space>
              <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddColumnModalVisible(true)}
              >
                Add Column
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const allVisible = columns.every((col) => col.visible);
                  const updatedColumns = columns.map((col) => ({
                    ...col,
                    visible: !allVisible,
                  }));
                  onColumnsChange(updatedColumns);
                }}
              >
                {columns.every((col) => col.visible) ? "Hide All" : "Show All"}
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <ColumnList>
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
                <MenuOutlined style={{ fontSize: 14, color: "#9ca3af" }} />
                {column.fieldType && getFieldIcon(column.fieldType)}
                <Text strong style={{ fontSize: "14px" }}>
                  {column.title}
                </Text>
                {column.required && (
                  <Tooltip title="Required field">
                    <StarTwoTone style={{ fontSize: 10 }} twoToneColor="#ef4444" />
                  </Tooltip>
                )}
              </ColumnTitle>

              <ColumnControls>
                <Space size="small">
                  {column.isCustom && (
                    <Tooltip title="Delete column">
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                        onClick={() => deleteColumn(column.id)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title={column.visible ? "Hide column" : "Show column"}>
                    <Switch
                      size="small"
                      checked={column.visible}
                      onChange={() => toggleColumnVisibility(column.id)}
                    />
                  </Tooltip>
                </Space>
              </ColumnControls>
            </ColumnHeader>

            {column.visible && (
              <ColumnDetails>
                <WidthInputField
                  column={column}
                  updateColumn={updateColumn}
                />

                <div>
                  <Text
                    style={{ fontSize: "12px", color: "#4b5563" }}
                  >
                    Type
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
                  <Space size="small">
                    <Tooltip title="Sortable">
                      <Button
                        size="small"
                        type={column.sortable ? "primary" : "default"}
                        icon={<SortAscendingOutlined style={{ fontSize: 12 }} />}
                        onClick={() =>
                          updateColumn(column.id, {
                            sortable: !column.sortable,
                          })
                        }
                      />
                    </Tooltip>

                    <Tooltip title="Filterable">
                      <Button
                        size="small"
                        type={column.filterable ? "primary" : "default"}
                        icon={<FilterOutlined style={{ fontSize: 12 }} />}
                        onClick={() =>
                          updateColumn(column.id, {
                            filterable: !column.filterable,
                          })
                        }
                      />
                    </Tooltip>
                  </Space>
                </div>

                <div>
                  <Text
                    style={{ fontSize: "12px", color: "#4b5563" }}
                  >
                    Fixed
                  </Text>
                  <Select
                    size="small"
                    value={column.fixed || "none"}
                    onChange={(value) =>
                      updateColumn(column.id, {
                        fixed: value === "none" ? undefined : value,
                      })
                    }
                    style={{ width: "100%", marginTop: "2px" }}
                  >
                    <Option value="none">None</Option>
                    <Option value="left">Left</Option>
                    <Option value="right">Right</Option>
                  </Select>
                </div>
              </ColumnDetails>
            )}
          </ColumnItem>
        ))}
      </ColumnList>

      {/* Advanced Add Column Modal */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            <span>Advanced Column Configuration</span>
          </Space>
        }
        open={isAddColumnModalVisible}
        onOk={handleAddColumn}
        onCancel={() => {
          setIsAddColumnModalVisible(false);
          form.resetFields();
        }}
        okText="Create Column"
        cancelText="Cancel"
        width={800}
        style={{ top: 20 }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: 'text',
            width: 150,
            sortable: false,
            filterable: false,
            fixed: 'none',
            // Permissions defaults
            'permissions.view': ['admin', 'user', 'viewer'],
            'permissions.edit': ['admin'],
            'permissions.export': ['admin', 'user'],
            'permissions.filter': ['admin', 'user'],
            'permissions.sort': ['admin', 'user', 'viewer'],
            // Security defaults
            'security.encrypted': false,
            'security.masked': false,
            'security.auditLog': false,
            'security.piiData': false
          }}
        >
          <Tabs
            defaultActiveKey="basic"
            items={[
              {
                key: 'basic',
                label: (
                  <Space>
                    <SettingOutlined />
                    Basic Settings
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Form.Item
                      name="title"
                      label="Column Title"
                      rules={[
                        { required: true, message: 'Please enter column title' },
                        { min: 1, max: 50, message: 'Title must be between 1-50 characters' }
                      ]}
                    >
                      <Input placeholder="Enter column title" />
                    </Form.Item>

                    <Form.Item
                      name="dataIndex"
                      label="Data Field"
                      rules={[
                        { required: true, message: 'Please enter data field name' },
                        { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: 'Field name must be valid (letters, numbers, underscore)' }
                      ]}
                    >
                      <Input placeholder="e.g., custom_field_name" />
                    </Form.Item>

                    <Form.Item
                      name="type"
                      label="Column Type"
                      rules={[{ required: true, message: 'Please select column type' }]}
                    >
                      <Select placeholder="Select column type">
                        {getColumnTypeOptions().map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Form.Item
                        name="width"
                        label="Width (px)"
                        rules={[
                          { required: true, message: 'Please enter width' },
                          { type: 'number', min: 50, max: 1000, message: 'Width must be between 50-1000px' }
                        ]}
                      >
                        <InputNumber placeholder="150" style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name="fixed"
                        label="Fixed Position"
                      >
                        <Select>
                          <Option value="none">None</Option>
                          <Option value="left">Left</Option>
                          <Option value="right">Right</Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Form.Item
                        name="sortable"
                        valuePropName="checked"
                      >
                        <Space>
                          <Switch size="small" />
                          <Text>Sortable</Text>
                        </Space>
                      </Form.Item>

                      <Form.Item
                        name="filterable"
                        valuePropName="checked"
                      >
                        <Space>
                          <Switch size="small" />
                          <Text>Filterable</Text>
                        </Space>
                      </Form.Item>
                    </div>
                  </div>
                )
              },
              {
                key: 'permissions',
                label: (
                  <Space>
                    <SecurityScanOutlined />
                    Role Permissions
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Text strong style={{ fontSize: '14px' }}>Configure role-based access control for this column</Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Form.Item
                      name={['permissions', 'view']}
                      label={<Space><EyeOutlined />View Access</Space>}
                    >
                      <Checkbox.Group
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Manager', value: 'manager' },
                          { label: 'User', value: 'user' },
                          { label: 'Viewer', value: 'viewer' },
                          { label: 'Guest', value: 'guest' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name={['permissions', 'edit']}
                      label={<Space><EditOutlined />Edit Access</Space>}
                    >
                      <Checkbox.Group
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Manager', value: 'manager' },
                          { label: 'User', value: 'user' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name={['permissions', 'export']}
                      label={<Space><ExportOutlined />Export Access</Space>}
                    >
                      <Checkbox.Group
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Manager', value: 'manager' },
                          { label: 'User', value: 'user' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name={['permissions', 'filter']}
                      label={<Space><FilterOutlined />Filter Access</Space>}
                    >
                      <Checkbox.Group
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Manager', value: 'manager' },
                          { label: 'User', value: 'user' },
                          { label: 'Viewer', value: 'viewer' }
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      name={['permissions', 'sort']}
                      label={<Space><SortAscendingOutlined />Sort Access</Space>}
                    >
                      <Checkbox.Group
                        options={[
                          { label: 'Admin', value: 'admin' },
                          { label: 'Manager', value: 'manager' },
                          { label: 'User', value: 'user' },
                          { label: 'Viewer', value: 'viewer' }
                        ]}
                      />
                    </Form.Item>
                  </div>
                )
              },
              {
                key: 'security',
                label: (
                  <Space>
                    <LockOutlined />
                    Security & Privacy
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Text strong style={{ fontSize: '14px' }}>Data security and privacy settings</Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Form.Item
                      name={['security', 'encrypted']}
                      valuePropName="checked"
                    >
                      <Space>
                        <Switch />
                        <div>
                          <Text strong>Encrypt Data</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>Encrypt column data at rest</Text>
                        </div>
                      </Space>
                    </Form.Item>

                    <Form.Item
                      name={['security', 'masked']}
                      valuePropName="checked"
                    >
                      <Space>
                        <Switch />
                        <div>
                          <Text strong>Mask Sensitive Data</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>Show masked values (e.g., ***-**-1234)</Text>
                        </div>
                      </Space>
                    </Form.Item>

                    <Form.Item
                      name={['security', 'auditLog']}
                      valuePropName="checked"
                    >
                      <Space>
                        <Switch />
                        <div>
                          <Text strong>Audit Logging</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>Log all access and modifications</Text>
                        </div>
                      </Space>
                    </Form.Item>

                    <Form.Item
                      name={['security', 'piiData']}
                      valuePropName="checked"
                    >
                      <Space>
                        <Switch />
                        <div>
                          <Text strong>PII Data</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>Mark as Personally Identifiable Information</Text>
                        </div>
                      </Space>
                    </Form.Item>
                  </div>
                )
              },
              {
                key: 'customization',
                label: (
                  <Space>
                    <i className="ri-star-line"></i>
                    Advanced Features
                  </Space>
                ),
                children: (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Text strong style={{ fontSize: '14px' }}>Advanced customization options</Text>
                    <Divider style={{ margin: '12px 0' }} />
                    
                    <Form.Item
                      name={['customization', 'tooltip']}
                      label="Custom Tooltip"
                    >
                      <Input.TextArea 
                        placeholder="Enter custom tooltip text for this column"
                        rows={2}
                      />
                    </Form.Item>

                    <Form.Item
                      name={['customization', 'aggregation']}
                      label="Aggregation Function"
                    >
                      <Select placeholder="Select aggregation type">
                        <Option value="none">None</Option>
                        <Option value="sum">Sum</Option>
                        <Option value="avg">Average</Option>
                        <Option value="count">Count</Option>
                        <Option value="min">Minimum</Option>
                        <Option value="max">Maximum</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name={['customization', 'clickAction']}
                      label="Click Action"
                    >
                      <Select placeholder="Select click behavior">
                        <Option value="none">None</Option>
                        <Option value="edit">Edit Cell</Option>
                        <Option value="view">View Details</Option>
                        <Option value="copy">Copy Value</Option>
                        <Option value="custom">Custom Action</Option>
                      </Select>
                    </Form.Item>

                    <Text strong style={{ fontSize: '12px', color: '#666' }}>Conditional Formatting</Text>
                    <div style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '6px', 
                      padding: '12px', 
                      marginTop: '8px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Advanced conditional formatting rules will be available in the column editor after creation.
                      </Text>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </Form>
      </Modal>
    </ColumnManagerContainer>
  );
}