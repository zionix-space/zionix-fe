import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Rate,
  Avatar,
  Tooltip,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckOutlined,
  ReloadOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Search } = Input;
const { Option } = Select;

const PreviewContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const PreviewHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow: auto;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
`;

/**
 * LowCode-Style List View Preview
 * Shows live preview of the configured list view with sample data
 */
export function ListViewPreview({ config, schema }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  // Generate sample data for preview
  const generateSampleData = () => {
    const sampleData = [];
    for (let i = 1; i <= 50; i++) {
      const record = {
        id: `REC${i.toString().padStart(3, "0")}`,
        created_at: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: ["Draft", "Submitted", "Approved", "Rejected"][
          Math.floor(Math.random() * 4)
        ],
      };

      // Add sample data for form fields
      const fields = schema.sections 
        ? schema.sections.flatMap(section => section.fields || [])
        : schema.components ? Object.values(schema.components) : [];
      
      fields.forEach((field) => {
        if (field && field.id && field.type) {
          record[field.id] = generateSampleFieldValue(
            field.type,
            field.options
          );
        }
      });

      sampleData.push(record);
    }
    return sampleData;
  };

  const generateSampleFieldValue = (fieldType, options) => {
    switch (fieldType) {
      case "text":
        return ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"][
          Math.floor(Math.random() * 4)
        ];
      case "email":
        return ["john@example.com", "jane@example.com", "mike@example.com"][
          Math.floor(Math.random() * 3)
        ];
      case "number":
        return Math.floor(Math.random() * 1000);
      case "currency":
        return (Math.random() * 10000).toFixed(2);
      case "date":
        return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
      case "dropdown":
        return options
          ? options[Math.floor(Math.random() * options.length)]
          : "Option 1";
      case "checkbox":
      case "yesno":
        return Math.random() > 0.5;
      case "rating":
        return Math.floor(Math.random() * 5) + 1;
      case "phone":
        return "+1 (555) 123-4567";
      case "department":
        return ["Engineering", "Marketing", "Sales", "HR"][
          Math.floor(Math.random() * 4)
        ];
      case "user":
        return ["John Doe", "Jane Smith", "Mike Johnson"][
          Math.floor(Math.random() * 3)
        ];
      default:
        return "Sample Data";
    }
  };

  const sampleData = generateSampleData();

  // Convert list columns to Ant Design table columns
  const tableColumns = config.columns
    .filter((col) => col.visible)
    .map((col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key,
      width: col.width,
      fixed: col.fixed,
      sorter: col.sortable,
      render: (value, record) => renderCellValue(value, col, record),
    }));

  const renderCellValue = (value, column, record) => {
    switch (column.type) {
      case "currency":
        return `$${parseFloat(value || 0).toLocaleString()}`;

      case "date":
        return value ? new Date(value).toLocaleDateString() : "-";

      case "datetime":
        return value ? new Date(value).toLocaleString() : "-";

      case "boolean":
        return value ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>;

      case "status":
        const statusColors = {
          Draft: "default",
          Submitted: "processing",
          Approved: "success",
          Rejected: "error",
        };
        return <Tag color={statusColors[value] || "default"}>{value}</Tag>;

      case "rating":
        return <Rate disabled value={value} style={{ fontSize: "14px" }} />;

      case "user":
        return (
          <Space>
            <Avatar size="small" icon={<UserOutlined style={{ fontSize: "12px" }} />} />
            {value}
          </Space>
        );

      case "email":
        return <a href={`mailto:${value}`}>{value}</a>;

      case "phone":
        return <a href={`tel:${value}`}>{value}</a>;

      case "file":
        return value ? (
          <Button type="link" size="small" icon={<DownloadOutlined style={{ fontSize: "12px" }} />}>
            Download
          </Button>
        ) : (
          "-"
        );

      case "image":
        return value ? (
          <img
            src={value}
            alt="Preview"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          "-"
        );

      case "tags":
        return Array.isArray(value) ? (
          <Space wrap>
            {value.map((tag, index) => (
              <Tag key={index} size="small">
                {tag}
              </Tag>
            ))}
          </Space>
        ) : (
          value
        );

      default:
        return value || "-";
    }
  };

  const bulkActions = [
    {
      key: "export",
      label: (
        <Space>
          <DownloadOutlined style={{ fontSize: "14px" }} />
          Export Selected
        </Space>
      ),
    },
    {
      key: "delete",
      label: (
        <Space>
          <DeleteOutlined style={{ fontSize: "14px" }} />
          Delete Selected
        </Space>
      ),
      danger: true,
    },
    {
      key: "approve",
      label: (
        <Space>
          <CheckOutlined style={{ fontSize: "14px" }} />
          Approve Selected
        </Space>
      ),
    },
  ];

  return (
    <PreviewContainer>
      <PreviewHeader>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            {config.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            {sampleData.length} records
          </p>
        </div>

        <Space>
          <Button icon={<ReloadOutlined style={{ fontSize: "14px" }} />}>Refresh</Button>
          <Button icon={<DownloadOutlined style={{ fontSize: "14px" }} />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined style={{ fontSize: "14px" }} />}>
            Add Record
          </Button>
        </Space>
      </PreviewHeader>

      <PreviewContent>
        {/* Action Bar */}
        <ActionBar>
          <Space>
            {config.settings.enableSearch && (
              <Search
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            )}

            <Select
              placeholder="Filter by status"
              style={{ width: 150 }}
              allowClear
            >
              <Option value="draft">Draft</Option>
              <Option value="submitted">Submitted</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Space>

          {selectedRows.length > 0 && (
            <Space>
              <span style={{ fontSize: "14px", color: "#4b5563" }}>
                {selectedRows.length} selected
              </span>
              <Dropdown
                menu={{
                  items: bulkActions,
                  onClick: ({ key }) => {
                    // Handle bulk action
                  },
                }}
                trigger={["click"]}
              >
                <Button>
                  Bulk Actions
                  <DownOutlined style={{ fontSize: "14px" }} />
                </Button>
              </Dropdown>
            </Space>
          )}
        </ActionBar>

        {/* Data Table */}
        <Table
          columns={tableColumns}
          dataSource={sampleData}
          rowKey="id"
          size="small"
          scroll={{ x: "max-content", y: 400 }}
          pagination={{
            pageSize: config.pagination.pageSize,
            showSizeChanger: config.pagination.showSizeChanger,
            showQuickJumper: config.pagination.showQuickJumper,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          rowSelection={
            config.settings.allowBulkActions
              ? {
                  selectedRowKeys: selectedRows,
                  onChange: (keys) => setSelectedRows(keys),
                  type: "checkbox",
                }
              : undefined
          }
        />
      </PreviewContent>
    </PreviewContainer>
  );
}