import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Tooltip,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  BoldOutlined,
  ItalicOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SaveOutlined,
  BgColorsOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  LockOutlined,
  FunctionOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Search } = Input;

const PreviewContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const PreviewHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SheetToolbar = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const FormulaBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  gap: 8px;
  font-size: 12px;
`;

const CellReference = styled.div`
  min-width: 60px;
  padding: 2px 6px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
  text-align: center;
`;

const FormulaInput = styled(Input)`
  flex: 1;
  font-family: monospace;
  font-size: 11px;
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow: auto;

  .ant-table-wrapper {
    .ant-table {
      font-size: 11px;

      .ant-table-thead > tr > th {
        background-color: #f3f4f6;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 8px;
        text-align: center;
        border-right: 1px solid #d1d5db;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #eff6ff;
        }
      }

      .ant-table-tbody > tr > td {
        padding: 2px 6px;
        border-right: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
        cursor: cell;

        &:hover {
          background-color: #f0f9ff;
        }

        &.selected-cell {
          background-color: #dbeafe;
          border: 2px solid #3b82f6;
        }
      }

      .row-header {
        background-color: #f3f4f6;
        font-weight: 600;
        text-align: center;
        width: 40px;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #eff6ff;
        }
      }
    }
  }
`;



/**
 * LowCode-Style Sheet View Preview
 * Shows live preview of the configured spreadsheet with sample data
 */
export function SheetViewPreview({ config, schema }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [formulaValue, setFormulaValue] = useState("");

  // Generate sample spreadsheet data
  const generateSampleData = () => {
    const data = [];
    for (let i = 1; i <= 20; i++) {
      const record = {
        key: i,
        row_number: i,
      };

      // Add sample data for each column
      config.columns.forEach((column, colIndex) => {
        if (column.id === "row_number") return;

        switch (column.type) {
          case "text":
            record[column.id] = `Sample ${i}`;
            break;
          case "number":
            record[column.id] = Math.floor(Math.random() * 1000);
            break;
          case "currency":
            record[column.id] = (Math.random() * 10000).toFixed(2);
            break;
          case "date":
            record[column.id] = new Date(
              Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0];
            break;
          case "datetime":
            record[column.id] = new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString();
            break;
          case "boolean":
            record[column.id] = Math.random() > 0.5;
            break;
          case "dropdown":
            record[column.id] = column.options
              ? column.options[
                  Math.floor(Math.random() * column.options.length)
                ]
              : "Option 1";
            break;
          case "status":
            record[column.id] = [
              "Draft",
              "In Progress",
              "Completed",
              "Approved",
            ][Math.floor(Math.random() * 4)];
            break;
          case "email":
            record[column.id] = `user${i}@example.com`;
            break;
          case "phone":
            record[column.id] = `+1 (555) ${String(
              Math.floor(Math.random() * 900) + 100
            )}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
            break;
          case "formula":
            record[column.id] = `=B${i}*C${i}`;
            break;
          default:
            record[column.id] = `Data ${i}`;
        }
      });

      data.push(record);
    }
    return data;
  };

  const sampleData = generateSampleData();

  // Convert sheet columns to Ant Design table columns
  const tableColumns = config.columns.map((col, index) => ({
    title: col.title || "",
    dataIndex: col.id,
    key: col.id,
    width: col.width,
    fixed: col.frozen ? "left" : undefined,
    className: col.id === "row_number" ? "row-header" : undefined,
    render: (value, record, rowIndex) => {
      const isSelected =
        selectedCell?.row === rowIndex && selectedCell?.col === index;

      if (col.id === "row_number") {
        return (
          <div
            onClick={() => {
              setSelectedCell({ row: rowIndex, col: index });
              setFormulaValue(String(value || ""));
            }}
          >
            {String(value || "")}
          </div>
        );
      }

      return (
        <div
          className={isSelected ? "selected-cell" : ""}
          onClick={() => {
            setSelectedCell({ row: rowIndex, col: index });
            setFormulaValue(String(value || ""));
          }}
          style={{
            minHeight: "18px",
            width: "100%",
          }}
        >
          {renderCellValue(value, col)}
        </div>
      );
    },
  }));

  const renderCellValue = (value, column) => {
    if (value === null || value === undefined) {
      return "";
    }

    switch (column.type) {
      case "currency":
        return `$${parseFloat(value || 0).toLocaleString()}`;

      case "date":
        return value ? new Date(value).toLocaleDateString() : "";

      case "datetime":
        return value ? new Date(value).toLocaleString() : "";

      case "boolean":
        return (
          <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
        );

      case "status":
        const statusColors = {
          Draft: "default",
          "In Progress": "processing",
          Completed: "success",
          Approved: "success",
        };
        return (
          <Tag color={statusColors[String(value)] || "default"}>
            {String(value)}
          </Tag>
        );

      case "formula":
        return (
          <span
            style={{
              color: "#2563eb",
              fontFamily: "monospace",
            }}
          >
            {String(value)}
          </span>
        );

      case "email":
        return <a href={`mailto:${value}`}>{String(value)}</a>;

      case "phone":
        return <a href={`tel:${value}`}>{String(value)}</a>;

      default:
        return String(value || "");
    }
  };

  const toolbarMenuItems = [
    {
      key: "insert-row",
      label: "Insert Row Above",
      icon: React.createElement(PlusOutlined),
    },
    {
      key: "insert-row-below",
      label: "Insert Row Below",
      icon: React.createElement(PlusOutlined),
    },
    {
      key: "insert-column",
      label: "Insert Column",
      icon: React.createElement(PlusOutlined),
    },
    {
      key: "delete-row",
      label: "Delete Row",
      icon: React.createElement(MinusOutlined),
    },
    {
      key: "delete-column",
      label: "Delete Column",
      icon: React.createElement(MinusOutlined),
    },
  ];

  const formatMenuItems = [
    {
      key: "bold",
      label: "Bold",
      icon: React.createElement(BoldOutlined),
    },
    {
      key: "italic",
      label: "Italic",
      icon: React.createElement(ItalicOutlined),
    },
    {
      key: "currency",
      label: "Currency Format",
      icon: React.createElement(DollarOutlined),
    },
    {
      key: "percentage",
      label: "Percentage Format",
      icon: React.createElement(PercentageOutlined),
    },
    {
      key: "date",
      label: "Date Format",
      icon: React.createElement(CalendarOutlined),
    },
  ];

  return (
    <PreviewContainer>
      <PreviewHeader>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            {config.name || "Sheet View"}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            {sampleData.length} rows × {config.columns.length} columns
          </p>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button type="primary" icon={<SaveOutlined />}>
            Save
          </Button>
        </Space>
      </PreviewHeader>

      {/* Sheet Toolbar */}
      <SheetToolbar>
        <Space>
          <Dropdown menu={{ items: toolbarMenuItems }} trigger={["click"]}>
            <Button size="small" icon={<PlusOutlined />}>
              Insert
            </Button>
          </Dropdown>

          <Dropdown menu={{ items: formatMenuItems }} trigger={["click"]}>
            <Button size="small" icon={<BgColorsOutlined />}>
              Format
            </Button>
          </Dropdown>

          <Button size="small" icon={<CalculatorOutlined />}>
            Functions
          </Button>

          <Button size="small" icon={<BarChartOutlined />}>
            Chart
          </Button>
        </Space>

        <Space>
          <Tooltip title="Sort">
            <Button size="small" icon={<SortAscendingOutlined />} />
          </Tooltip>

          <Tooltip title="Filter">
            <Button size="small" icon={<FilterOutlined />} />
          </Tooltip>

          <Tooltip title="Freeze Panes">
            <Button size="small" icon={<LockOutlined />} />
          </Tooltip>
        </Space>
      </SheetToolbar>

      {/* Formula Bar */}
      <FormulaBar>
        <CellReference>
          {selectedCell
            ? `${String.fromCharCode(65 + selectedCell.col)}${
                selectedCell.row + 1
              }`
            : "A1"}
        </CellReference>
        <FunctionOutlined />
        <FormulaInput
          value={formulaValue}
          onChange={(e) => setFormulaValue(e.target.value)}
          placeholder="Enter formula or value..."
        />
      </FormulaBar>

      {/* Sheet Content */}
      <PreviewContent>
        <Table
          columns={tableColumns}
          dataSource={sampleData}
          pagination={false}
          size="small"
          bordered
          scroll={{ x: "max-content", y: 400 }}
          showHeader={true}
        />
      </PreviewContent>
    </PreviewContainer>
  );
}
