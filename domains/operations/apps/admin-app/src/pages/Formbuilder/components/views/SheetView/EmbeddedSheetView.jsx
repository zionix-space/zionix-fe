import React, { useState } from "react";
import {
  Table,
  Button,
  Select,
  Space,
  Dropdown,
  Tooltip,
  Input,
  Tag,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  BoldOutlined,
  ItalicOutlined,
  DollarOutlined,
  PercentageOutlined,
  BgColorsOutlined,
  CalculatorOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  BarChartOutlined,
  SaveOutlined,
  FunctionOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Option } = Select;

const SheetContainer = styled.div`
  background-color: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
  border: 1px solid #e5e7eb;
`;

const SheetToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  gap: 8px;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SheetContent = styled.div`
  overflow: auto;
  height: calc(100% - 48px);

  .ant-table-wrapper {
    .ant-table {
      font-size: 11px;

      .ant-table-thead > tr > th {
        background-color: #f3f4f6;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 6px;
        border-right: 1px solid #d1d5db;
        text-align: center;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #e5e7eb;
        }
      }

      .ant-table-tbody > tr > td {
        padding: 2px 4px;
        border-right: 1px solid #e5e7eb;
        border-bottom: 1px solid #e5e7eb;
        position: relative;

        &:hover {
          background-color: #dbeafe;
        }

        &.selected-cell {
          background-color: #dbeafe;
          border: 2px solid #3b82f6;
        }
      }

      .row-number {
        background-color: #f3f4f6;
        font-weight: 600;
        text-align: center;
        width: 40px;
        user-select: none;
        cursor: pointer;

        &:hover {
          background-color: #e5e7eb;
        }
      }
    }
  }
`;

const CellInput = styled(Input)`
  border: none;
  padding: 0;
  font-size: 11px;
  background: transparent;

  &:focus {
    box-shadow: none;
    border: none;
  }
`;

const FormulaBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  gap: 8px;
  font-size: 11px;
`;

const CellReference = styled.div`
  min-width: 60px;
  padding: 2px 6px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  font-family: monospace;
  font-size: 10px;
`;

const FormulaInput = styled(Input)`
  flex: 1;
  font-family: monospace;
  font-size: 11px;
`;

/**
 * Embedded Sheet View Component for Form Builder
 * Excel-like spreadsheet interface that can be embedded within a form section
 */
export function EmbeddedSheetView({ config, isPreview = false }) {
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [formulaValue, setFormulaValue] = useState("");

  // Generate sample sheet data
  const generateSheetData = () => {
    const columns = ["A", "B", "C", "D", "E", "F"];
    const data = [];

    for (let i = 1; i <= 10; i++) {
      const row = {
        key: i,
        rowNumber: i,
      };

      columns.forEach((col, colIndex) => {
        if (i === 1) {
          // Header row
          row[col] =
            ["Product", "Quantity", "Price", "Total", "Status", "Notes"][
              colIndex
            ] || `Col ${col}`;
        } else {
          // Data rows
          switch (colIndex) {
            case 0: // Product
              row[col] = [
                `Product ${i - 1}`,
                `Item ${i - 1}`,
                `Service ${i - 1}`,
              ][Math.floor(Math.random() * 3)];
              break;
            case 1: // Quantity
              row[col] = Math.floor(Math.random() * 100) + 1;
              break;
            case 2: // Price
              row[col] = (Math.random() * 1000).toFixed(2);
              break;
            case 3: // Total (Formula)
              row[col] = `=B${i}*C${i}`;
              break;
            case 4: // Status
              row[col] = ["Active", "Pending", "Completed"][
                Math.floor(Math.random() * 3)
              ];
              break;
            case 5: // Notes
              row[col] = `Note ${i - 1}`;
              break;
            default:
              row[col] = `${col}${i}`;
          }
        }
      });

      data.push(row);
    }

    return { columns, data };
  };

  const { columns: sheetColumns, data: sheetData } = generateSheetData();

  // Create table columns
  const tableColumns = [
    {
      title: "",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 40,
      className: "row-number",
      render: (value) => value,
    },
    ...sheetColumns.map((col, index) => ({
      title: col,
      dataIndex: col,
      key: col,
      width: 100,
      render: (value, record, rowIndex) => {
        const isSelected =
          selectedCell?.row === rowIndex && selectedCell?.col === index;
        const isEditing =
          editingCell?.row === rowIndex && editingCell?.col === index;

        if (isEditing) {
          return (
            <CellInput
              value={value}
              onChange={(e) => {
                // Update cell value
                const newData = [...sheetData];
                newData[rowIndex][col] = e.target.value;
              }}
              onBlur={() => setEditingCell(null)}
              onPressEnter={() => setEditingCell(null)}
              autoFocus
            />
          );
        }

        return (
          <div
            className={isSelected ? "selected-cell" : ""}
            onClick={() => {
              setSelectedCell({ row: rowIndex, col: index });
              setFormulaValue(value?.toString() || "");
            }}
            onDoubleClick={() => setEditingCell({ row: rowIndex, col: index })}
            style={{
              minHeight: "20px",
              cursor: "cell",
              padding: "2px 4px",
            }}
          >
            {typeof value === "string" && value.startsWith("=") ? (
              <span
                style={{
                  color: "#2563eb",
                  fontFamily: "monospace",
                }}
              >
                {value}
              </span>
            ) : (
              value
            )}
          </div>
        );
      },
    })),
  ];

  const toolbarMenuItems = [
    {
      key: "insert-row",
      label: "Insert Row",
      icon: <PlusOutlined />,
    },
    {
      key: "insert-column",
      label: "Insert Column",
      icon: <PlusOutlined />,
    },
    {
      key: "delete-row",
      label: "Delete Row",
      icon: <MinusOutlined />,
    },
    {
      key: "delete-column",
      label: "Delete Column",
      icon: <MinusOutlined />,
    },
  ];

  const formatMenuItems = [
    {
      key: "bold",
      label: "Bold",
      icon: <BoldOutlined />,
    },
    {
      key: "italic",
      label: "Italic",
      icon: <ItalicOutlined />,
    },
    {
      key: "currency",
      label: "Currency",
      icon: <DollarOutlined />,
    },
    {
      key: "percentage",
      label: "Percentage",
      icon: <PercentageOutlined />,
    },
  ];

  return (
    <SheetContainer>
      {/* Sheet Toolbar */}
      <SheetToolbar>
        <ToolbarSection>
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
        </ToolbarSection>

        <ToolbarSection>
          <Tooltip title="Sort">
            <Button size="small" icon={<SortAscendingOutlined />} />
          </Tooltip>

          <Tooltip title="Filter">
            <Button size="small" icon={<FilterOutlined />} />
          </Tooltip>

          <Tooltip title="Chart">
            <Button size="small" icon={<BarChartOutlined />} />
          </Tooltip>

          <Button type="primary" size="small" icon={<SaveOutlined />}>
            Save
          </Button>
        </ToolbarSection>
      </SheetToolbar>

      {/* Formula Bar */}
      <FormulaBar>
        <CellReference>
          {selectedCell
            ? `${sheetColumns[selectedCell.col]}${selectedCell.row + 1}`
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
      <SheetContent>
        <Table
          columns={tableColumns}
          dataSource={sheetData}
          pagination={false}
          size="small"
          bordered
          scroll={{ x: "max-content", y: 300 }}
          showHeader={true}
        />
      </SheetContent>
    </SheetContainer>
  );
}