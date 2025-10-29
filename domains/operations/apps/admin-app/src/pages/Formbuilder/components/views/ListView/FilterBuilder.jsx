import React, { useState } from "react";
import {
  Button,
  Select,
  Input,
  DatePicker,
  Space,
  Card,
  Typography,
  Divider,
} from "antd";
import { PlusOutlined, FilterOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterBuilderContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FilterList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FilterItem = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 12px;
  background-color: #ffffff;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

/**
 * LowCode-Style Filter Builder
 * Advanced filtering system with multiple operators and conditions
 */
export function FilterBuilder({
  filters,
  onFiltersChange,
  columns,
}) {
  const [newFilter, setNewFilter] = useState({
    operator: "equals",
    condition: "and",
  });

  const filterableColumns = columns.filter((col) => col.filterable);

  const getOperatorOptions = (columnType) => {
    const baseOperators = [
      { value: "equals", label: "Equals" },
      { value: "not_equals", label: "Not Equals" },
      { value: "is_empty", label: "Is Empty" },
      { value: "is_not_empty", label: "Is Not Empty" },
    ];

    const textOperators = [
      { value: "contains", label: "Contains" },
      { value: "not_contains", label: "Does Not Contain" },
      { value: "starts_with", label: "Starts With" },
      { value: "ends_with", label: "Ends With" },
    ];

    const numberOperators = [
      { value: "greater_than", label: "Greater Than" },
      { value: "less_than", label: "Less Than" },
      { value: "greater_equal", label: "Greater Than or Equal" },
      { value: "less_equal", label: "Less Than or Equal" },
      { value: "between", label: "Between" },
    ];

    const dateOperators = [
      { value: "before", label: "Before" },
      { value: "after", label: "After" },
      { value: "between", label: "Between" },
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "this_week", label: "This Week" },
      { value: "this_month", label: "This Month" },
      { value: "this_year", label: "This Year" },
    ];

    switch (columnType) {
      case "text":
      case "email":
      case "phone":
        return [...baseOperators, ...textOperators];
      case "number":
      case "currency":
        return [...baseOperators, ...numberOperators];
      case "date":
      case "datetime":
        return [...baseOperators, ...dateOperators];
      case "boolean":
        return [
          { value: "equals", label: "Is" },
          { value: "not_equals", label: "Is Not" },
        ];
      case "select":
        return [
          { value: "equals", label: "Is" },
          { value: "not_equals", label: "Is Not" },
          { value: "in", label: "Is One Of" },
          { value: "not_in", label: "Is Not One Of" },
        ];
      default:
        return baseOperators;
    }
  };

  const addFilter = () => {
    if (!newFilter.field || !newFilter.operator) return;

    const filter = {
      id: `filter_${Date.now()}`,
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value || "",
      condition: newFilter.condition || "and",
    };

    onFiltersChange([...filters, filter]);
    setNewFilter({ operator: "equals", condition: "and" });
  };

  const updateFilter = (filterId, updates) => {
    const updatedFilters = filters.map((filter) =>
      filter.id === filterId ? { ...filter, ...updates } : filter
    );
    onFiltersChange(updatedFilters);
  };

  const removeFilter = (filterId) => {
    onFiltersChange(filters.filter((filter) => filter.id !== filterId));
  };

  const renderValueInput = (filter, column) => {
    const columnType = column?.type || "text";

    if (
      [
        "is_empty",
        "is_not_empty",
        "today",
        "yesterday",
        "this_week",
        "this_month",
        "this_year",
      ].includes(filter.operator)
    ) {
      return null;
    }

    switch (columnType) {
      case "number":
      case "currency":
        return (
          <Input
            type="number"
            placeholder="Enter value"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            style={{ width: 150 }}
          />
        );

      case "date":
      case "datetime":
        if (filter.operator === "between") {
          return (
            <RangePicker
              value={filter.value}
              onChange={(dates) => updateFilter(filter.id, { value: dates })}
              style={{ width: 250 }}
            />
          );
        }
        return (
          <DatePicker
            value={filter.value}
            onChange={(date) => updateFilter(filter.id, { value: date })}
            style={{ width: 150 }}
          />
        );

      case "boolean":
        return (
          <Select
            value={filter.value}
            onChange={(value) => updateFilter(filter.id, { value })}
            style={{ width: 100 }}
          >
            <Option value={true}>True</Option>
            <Option value={false}>False</Option>
          </Select>
        );

      case "select":
        // In a real implementation, you'd get options from the field definition
        return (
          <Select
            mode={
              ["in", "not_in"].includes(filter.operator)
                ? "multiple"
                : undefined
            }
            value={filter.value}
            onChange={(value) => updateFilter(filter.id, { value })}
            style={{ width: 200 }}
            placeholder="Select value(s)"
          >
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
            <Option value="option3">Option 3</Option>
          </Select>
        );

      default:
        return (
          <Input
            placeholder="Enter value"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            style={{ width: 200 }}
          />
        );
    }
  };

  return (
    <FilterBuilderContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Filter Configuration</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Create advanced filters to refine your data view
          </Text>

          <Divider style={{ margin: "12px 0" }} />

          {/* Add New Filter */}
          <div>
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Add New Filter
            </Text>

            <Space wrap>
              <Select
                placeholder="Select field"
                value={newFilter.field}
                onChange={(value) =>
                  setNewFilter({ ...newFilter, field: value })
                }
                style={{ width: 150 }}
              >
                {filterableColumns.map((column) => (
                  <Option key={column.id} value={column.id}>
                    {column.title}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Operator"
                value={newFilter.operator}
                onChange={(value) =>
                  setNewFilter({ ...newFilter, operator: value })
                }
                style={{ width: 150 }}
              >
                {newFilter.field &&
                  getOperatorOptions(
                    filterableColumns.find((col) => col.id === newFilter.field)
                      ?.type || "text"
                  ).map((op) => (
                    <Option key={op.value} value={op.value}>
                      {op.label}
                    </Option>
                  ))}
              </Select>

              <Button
                type="primary"
                icon={<PlusOutlined style={{ fontSize: 14 }} />}
                onClick={addFilter}
                disabled={!newFilter.field || !newFilter.operator}
              >
                Add Filter
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <FilterList>
        {filters.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "16px" }}>
              <FilterOutlined style={{ fontSize: 32, color: "#9ca3af" }} />
              <Text
                type="secondary"
                style={{ display: "block", marginTop: "8px" }}
              >
                No filters configured
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Add filters to refine your data view
              </Text>
            </div>
          </Card>
        ) : (
          filters.map((filter, index) => {
            const column = filterableColumns.find(
              (col) => col.id === filter.field
            );

            return (
              <FilterItem key={filter.id}>
                {index > 0 && (
                  <FilterRow>
                    <Select
                      value={filter.condition}
                      onChange={(value) =>
                        updateFilter(filter.id, { condition: value })
                      }
                      style={{ width: 80 }}
                    >
                      <Option value="and">AND</Option>
                      <Option value="or">OR</Option>
                    </Select>
                  </FilterRow>
                )}

                <FilterRow>
                  <Select
                    value={filter.field}
                    onChange={(value) =>
                      updateFilter(filter.id, { field: value })
                    }
                    style={{ width: 150 }}
                  >
                    {filterableColumns.map((column) => (
                      <Option key={column.id} value={column.id}>
                        {column.title}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    value={filter.operator}
                    onChange={(value) =>
                      updateFilter(filter.id, { operator: value })
                    }
                    style={{ width: 150 }}
                  >
                    {getOperatorOptions(column?.type || "text").map((op) => (
                      <Option key={op.value} value={op.value}>
                        {op.label}
                      </Option>
                    ))}
                  </Select>

                  {renderValueInput(filter, column)}

                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                    onClick={() => removeFilter(filter.id)}
                  />
                </FilterRow>
              </FilterItem>
            );
          })
        )}
      </FilterList>
    </FilterBuilderContainer>
  );
}