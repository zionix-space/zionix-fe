import React from "react";
import { Table, Button, Input, Select, Space, Tag } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Search } = Input;
const { Option } = Select;

const ListViewContainer = styled.div`
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
`;

const ListViewToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const ListViewContent = styled.div`
  overflow: auto;

  .ant-table-wrapper {
    .ant-table {
      font-size: 12px;
    }

    .ant-table-thead > tr > th {
      background-color: #f9fafb;
      font-size: 11px;
      font-weight: 500;
      padding: 8px 12px;
    }

    .ant-table-tbody > tr > td {
      padding: 6px 12px;
    }
  }
`;

/**
 * Embedded List View Component for Form Builder
 * Displays a compact list view that can be embedded within a form section
 */
export function EmbeddedListView({
  config,
  isPreview = false,
}) {
  // Generate sample data for preview
  const generateSampleData = () => {
    const data = [];
    for (let i = 1; i <= 5; i++) {
      data.push({
        key: i,
        id: `REC${i.toString().padStart(3, "0")}`,
        name: `Sample Item ${i}`,
        status: ["Draft", "In Progress", "Completed", "Approved"][
          Math.floor(Math.random() * 4)
        ],
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        amount: `$${(Math.random() * 1000).toFixed(2)}`,
      });
    }
    return data;
  };

  // Sample columns for preview
  const sampleColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          Draft: "default",
          "In Progress": "processing",
          Completed: "success",
          Approved: "success",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: () => (
        <Button type="link" size="small" icon={<EyeOutlined style={{ fontSize: 14 }} />} />
      ),
    },
  ];

  const sampleData = generateSampleData();

  return (
    <ListViewContainer>
      <ListViewToolbar>
        <Space>
          <Search placeholder="Search..." style={{ width: 180 }} size="small" />
          <Select defaultValue="all" style={{ width: 120 }} size="small">
            <Option value="all">All Status</Option>
            <Option value="draft">Draft</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Space>

        <Button type="primary" size="small" icon={<PlusOutlined style={{ fontSize: 14 }} />}>
          Add New
        </Button>
      </ListViewToolbar>

      <ListViewContent>
        <Table
          columns={sampleColumns}
          dataSource={sampleData}
          size="small"
          pagination={{
            size: "small",
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      </ListViewContent>
    </ListViewContainer>
  );
}