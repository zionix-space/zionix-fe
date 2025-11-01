import React from "react";
import { Select, Slider, Card, Space, Typography, Radio } from "antd";
import styled from "styled-components";
// // import { theme } from "../../../../styles/theme"; // Removed problematic import

const { Text } = Typography;
const { Option } = Select;

const LayoutEditorContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PreviewGrid = styled.div`
  ${({ layoutType, columns }) => {
    if (layoutType === "masonry") {
      return `
        column-count: ${columns};
        column-gap: 8px;
      `;
    } else if (layoutType === "grid") {
      return `
        display: grid;
        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        gap: 8px;
      `;
    } else {
      return `
        display: flex;
        flex-direction: column;
        gap: 8px;
      `;
    }
  }}

  height: 120px;
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e5e7eb;
`;

const PreviewItem = styled.div`
  background-color: #dbeafe;
  border-radius: 4px;
  height: ${({ height = 20, layoutType }) =>
    layoutType === "masonry" ? `${height}px` : "20px"};

  ${({ layoutType }) =>
    layoutType === "masonry" &&
    `
    break-inside: avoid;
    margin-bottom: 8px;
    display: inline-block;
    width: 100%;
  `}
`;

/**
 * LowCode-Style Gallery Layout Editor
 * Professional layout configuration with live preview
 */
export function GalleryLayoutEditor({
  layout,
  onLayoutChange,
}) {
  const updateLayout = (updates) => {
    onLayoutChange({ ...layout, ...updates });
  };

  const updateResponsive = (breakpoint, columns) => {
    updateLayout({
      responsive: {
        ...layout.responsive,
        [breakpoint]: columns,
      },
    });
  };

  const renderPreview = () => {
    const items = [];
    const itemCount =
      layout.type === "list" ? 3 : Math.min(layout.columns * 2, 8);

    for (let i = 0; i < itemCount; i++) {
      const height =
        layout.type === "masonry"
          ? [30, 45, 25, 40, 35, 50, 20, 30][i % 8]
          : 20;

      items.push(
        <PreviewItem key={i} height={height} layoutType={layout.type} />
      );
    }

    return items;
  };

  return (
    <LayoutEditorContainer>
      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Layout Type</Text>
          <Radio.Group
            value={layout.type}
            onChange={(e) => updateLayout({ type: e.target.value })}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Radio value="grid">
                <div>
                  <Text strong>Grid Layout</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Fixed grid with equal-sized cards
                  </Text>
                </div>
              </Radio>
              <Radio value="masonry">
                <div>
                  <Text strong>Masonry Layout</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Pinterest-style layout with variable heights
                  </Text>
                </div>
              </Radio>
              <Radio value="list">
                <div>
                  <Text strong>List Layout</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Single column list view
                  </Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Grid Configuration</Text>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Columns ({layout.columns})
            </Text>
            <Slider
              min={1}
              max={6}
              value={layout.columns}
              onChange={(value) => updateLayout({ columns: value })}
              marks={{
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
              }}
              style={{ marginTop: "8px" }}
              disabled={layout.type === "list"}
            />
          </div>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Gap Size
            </Text>
            <Select
              value={layout.gap}
              onChange={(value) => updateLayout({ gap: value })}
              style={{ width: "100%", marginTop: "4px" }}
              size="small"
            >
              <Option value="xs">Extra Small (4px)</Option>
              <Option value="sm">Small (8px)</Option>
              <Option value="md">Medium (16px)</Option>
              <Option value="lg">Large (24px)</Option>
              <Option value="xl">Extra Large (32px)</Option>
            </Select>
          </div>

          {layout.type === "grid" && (
            <div>
              <Text style={{ fontSize: "12px", color: "#4b5563" }}>
                Aspect Ratio
              </Text>
              <Select
                value={layout.aspectRatio}
                onChange={(value) =>
                  updateLayout({ aspectRatio: value })
                }
                style={{ width: "100%", marginTop: "4px" }}
                size="small"
              >
                <Option value="auto">Auto</Option>
                <Option value="square">Square (1:1)</Option>
                <Option value="16:9">Widescreen (16:9)</Option>
                <Option value="4:3">Standard (4:3)</Option>
                <Option value="3:2">Photo (3:2)</Option>
              </Select>
            </div>
          )}
        </Space>
      </Card>

      <Card size="small" style={{ marginBottom: "16px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Responsive Breakpoints</Text>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Mobile {"(< 768px)"}: {layout.responsive.mobile} columns
            </Text>
            <Slider
              min={1}
              max={3}
              value={layout.responsive.mobile}
              onChange={(value) => updateResponsive("mobile", value)}
              marks={{ 1: "1", 2: "2", 3: "3" }}
              style={{ marginTop: "4px" }}
            />
          </div>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Tablet (768px - 1024px): {layout.responsive.tablet} columns
            </Text>
            <Slider
              min={1}
              max={4}
              value={layout.responsive.tablet}
              onChange={(value) => updateResponsive("tablet", value)}
              marks={{ 1: "1", 2: "2", 3: "3", 4: "4" }}
              style={{ marginTop: "4px" }}
            />
          </div>

          <div>
            <Text style={{ fontSize: "12px", color: "#4b5563" }}>
              Desktop ({"> 1024px"}): {layout.responsive.desktop} columns
            </Text>
            <Slider
              min={1}
              max={6}
              value={layout.responsive.desktop}
              onChange={(value) => updateResponsive("desktop", value)}
              marks={{ 1: "1", 3: "3", 6: "6" }}
              style={{ marginTop: "4px" }}
            />
          </div>
        </Space>
      </Card>

      <Card size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Layout Preview</Text>

          <PreviewGrid columns={layout.columns} layoutType={layout.type}>
            {renderPreview()}
          </PreviewGrid>
        </Space>
      </Card>
    </LayoutEditorContainer>
  );
}