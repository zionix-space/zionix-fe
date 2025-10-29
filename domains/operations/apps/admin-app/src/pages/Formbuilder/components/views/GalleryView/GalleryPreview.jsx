import React, { useState } from "react";
// import { FormSchema } from "../../../../types/formBuilder"; // Removed problematic import
// import { GalleryViewConfig, GalleryCard } from "../../../../types/galleryView"; // Removed problematic import
import {
  Input,
  Select,
  Button,
  Space,
  Tag,
  Rate,
  Avatar,
  Card,
  Badge,
} from "antd";
import {
  UserOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// import { theme } from "../../../../styles/theme";

const { Search } = Input;
const { Option } = Select;

const GalleryContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const GalleryHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GalleryToolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: #f9fafb;
`;

const GalleryContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const GalleryGrid = styled.div`
  ${({ layoutType, columns, gap }) => {
    const gapValue =
      {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      }[gap] || "16px";

    if (layoutType === "masonry") {
      return `
        column-count: ${columns};
        column-gap: ${gapValue};
        
        @media (max-width: 1024px) {
          column-count: ${Math.min(columns, 2)};
        }
        
        @media (max-width: 768px) {
          column-count: 1;
        }
      `;
    } else if (layoutType === "grid") {
      return `
        display: grid;
        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        gap: ${gapValue};
        
        @media (max-width: 1024px) {
          grid-template-columns: repeat(${Math.min(
            columns,
            2
          )}, minmax(0, 1fr));
        }
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      `;
    } else {
      return `
        display: flex;
        flex-direction: column;
        gap: ${gapValue};
      `;
    }
  }}
`;

const GalleryCardComponent = styled(Card)`
  width: ${({ cardWidth, layoutType }) =>
    layoutType === "masonry" ? "100%" : `${cardWidth}px`};
  ${({ cardHeight, layoutType }) =>
    layoutType !== "masonry" && `height: ${cardHeight}px;`}
  ${({ layoutType }) =>
    layoutType === "masonry" &&
    `
    break-inside: avoid;
    margin-bottom: 16px;
    display: inline-block;
    width: 100%;
  `}
  
  transition: all 0.3s ease;
  cursor: pointer;

  ${({ hoverEffect }) =>
    hoverEffect &&
    `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `}

  .ant-card-body {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: ${({ styling }) => styling.fontSize || "16px"};
  font-weight: ${({ styling }) => styling.fontWeight || "600"};
  color: ${({ styling }) => styling.color || "#111827"};
  text-align: ${({ styling }) => styling.alignment || "left"};
  margin: 0 0 8px 0;

  ${({ styling }) =>
    styling.truncate &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${styling.maxLines || 2};
    -webkit-box-orient: vertical;
  `}
`;

const CardDescription = styled.p`
  font-size: ${({ styling }) => styling.fontSize || "14px"};
  color: ${({ styling }) => styling.color || "#4b5563"};
  text-align: ${({ styling }) => styling.alignment || "left"};
  margin: 0 0 12px 0;
  flex: 1;

  ${({ styling }) =>
    styling.truncate &&
    `
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${styling.maxLines || 3};
    -webkit-box-orient: vertical;
  `}
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid "#f3f4f6";
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .gallery-card:hover & {
    opacity: 1;
  }
`;

const OverlayButton = styled(Button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

/**
 * LowCode-Style Gallery Preview
 * Shows live preview of the configured gallery view with sample data
 */
export function GalleryPreview({ config, schema }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterBy, setFilterBy] = useState("all");

  // Generate sample gallery data
  const generateSampleData = () => {
    const sampleImages = [
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400",
    ];

    const sampleTitles = [
      "Product Launch Campaign",
      "Marketing Strategy Review",
      "Customer Feedback Analysis",
      "Brand Identity Project",
      "Social Media Campaign",
      "Website Redesign Project",
      "Content Marketing Plan",
      "Email Campaign Results",
    ];

    const sampleDescriptions = [
      "Comprehensive analysis of our latest product launch with detailed metrics and customer feedback.",
      "Strategic review of current marketing initiatives and recommendations for improvement.",
      "In-depth analysis of customer feedback patterns and actionable insights.",
      "Complete brand identity overhaul including logo, colors, and messaging guidelines.",
      "Multi-platform social media campaign targeting key demographics.",
      "Modern website redesign focusing on user experience and conversion optimization.",
    ];

    const sampleStatuses = [
      "Draft",
      "In Progress",
      "Review",
      "Approved",
      "Published",
    ];

    const cards = [];
    for (let i = 1; i <= 24; i++) {
      cards.push({
        id: `card_${i}`,
        data: {
          title: sampleTitles[Math.floor(Math.random() * sampleTitles.length)],
          description:
            sampleDescriptions[
              Math.floor(Math.random() * sampleDescriptions.length)
            ],
          image: sampleImages[Math.floor(Math.random() * sampleImages.length)],
          status:
            sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)],
          rating: Math.floor(Math.random() * 5) + 1,
          author: ["John Doe", "Jane Smith", "Mike Johnson"][
            Math.floor(Math.random() * 3)
          ],
          category: ["Marketing", "Design", "Development"][
            Math.floor(Math.random() * 3)
          ],
        },
        thumbnail:
          sampleImages[Math.floor(Math.random() * sampleImages.length)],
        featured: Math.random() > 0.8,
        metadata: {
          created_at: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status:
            sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)],
        },
      });
    }
    return cards;
  };

  const sampleData = generateSampleData();

  const renderCardField = (field, cardData) => {
    const value =
      cardData.data[field.fieldId] || cardData.metadata[field.fieldId];

    switch (field.type) {
      case "image":
        return value ? <CardImage src={value} alt={field.label} /> : null;

      case "title":
        return <CardTitle styling={field.styling}>{value}</CardTitle>;

      case "description":
        return (
          <CardDescription styling={field.styling}>{value}</CardDescription>
        );

      case "status":
        const statusColors = {
          Draft: "default",
          "In Progress": "processing",
          Review: "warning",
          Approved: "success",
          Published: "success",
        };
        return <Tag color={statusColors[value] || "default"}>{value}</Tag>;

      case "date":
        return (
          <span
            style={{
              fontSize: field.styling.fontSize,
              color: field.styling.color,
            }}
          >
            {value ? new Date(value).toLocaleDateString() : ""}
          </span>
        );

      case "rating":
        return <Rate disabled value={value} style={{ fontSize: "14px" }} />;

      case "avatar":
        return (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            {value}
          </Space>
        );

      case "badge":
        return <Badge count={value} size="small" />;

      case "tags":
        return Array.isArray(value) ? (
          <Space wrap>
            {value.map((tag, index) => (
              <Tag key={index} size="small">
                {tag}
              </Tag>
            ))}
          </Space>
        ) : null;

      default:
        return <span>{value}</span>;
    }
  };

  const renderCard = (card) => {
    const template = config.cardTemplate;

    const headerFields = template.fields
      .filter((f) => f.position.area === "header" && f.visible)
      .sort((a, b) => a.position.order - b.position.order);

    const bodyFields = template.fields
      .filter((f) => f.position.area === "body" && f.visible)
      .sort((a, b) => a.position.order - b.position.order);

    const footerFields = template.fields
      .filter((f) => f.position.area === "footer" && f.visible)
      .sort((a, b) => a.position.order - b.position.order);

    return (
      <GalleryCardComponent
        key={card.id}
        className="gallery-card"
        cardWidth={template.width}
        cardHeight={template.height}
        layoutType={config.layout.type}
        hoverEffect={template.styling.hoverEffect}
        style={{
          backgroundColor: template.styling.backgroundColor,
          borderColor: template.styling.borderColor,
          borderRadius: template.styling.borderRadius,
          position: "relative",
        }}
        bodyStyle={{ padding: template.styling.padding }}
      >
        {/* Card Overlay Actions */}
        <CardOverlay>
          {template.actions
            .filter((a) => a.position === "overlay")
            .map((action) => {
              return (
                <OverlayButton key={action.id} size="small">
                  <EyeOutlined />
                </OverlayButton>
              );
            })}
        </CardOverlay>

        {/* Header Fields */}
        {headerFields.map((field) => (
          <div key={field.id}>{renderCardField(field, card)}</div>
        ))}

        {/* Body Fields */}
        <div style={{ flex: 1 }}>
          {bodyFields.map((field) => (
            <div key={field.id}>{renderCardField(field, card)}</div>
          ))}
        </div>

        {/* Footer Fields */}
        {footerFields.length > 0 && (
          <CardFooter>
            {footerFields.map((field) => (
              <div key={field.id}>{renderCardField(field, card)}</div>
            ))}
          </CardFooter>
        )}
      </GalleryCardComponent>
    );
  };

  return (
    <GalleryContainer>
      <GalleryHeader>
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
            {sampleData.length} items
          </p>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Item
          </Button>
        </Space>
      </GalleryHeader>

      {/* Toolbar */}
      {(config.settings.showSearch ||
        config.settings.showFilters ||
        config.settings.showSorting) && (
        <GalleryToolbar>
          <Space>
            {config.settings.showSearch && (
              <Search
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
            )}

            {config.settings.showFilters && (
              <Select
                placeholder="Filter by category"
                value={filterBy}
                onChange={setFilterBy}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="all">All Categories</Option>
                <Option value="marketing">Marketing</Option>
                <Option value="design">Design</Option>
                <Option value="development">Development</Option>
              </Select>
            )}
          </Space>

          <Space>
            {config.settings.showSorting && (
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 150 }}
              >
                <Option value="created_at">Newest First</Option>
                <Option value="updated_at">Recently Updated</Option>
                <Option value="title">Title A-Z</Option>
                <Option value="status">Status</Option>
              </Select>
            )}

            <Button icon={<AppstoreOutlined />} />
            <Button icon={<UnorderedListOutlined />} />
          </Space>
        </GalleryToolbar>
      )}

      {/* Gallery Content */}
      <GalleryContent>
        <GalleryGrid
          columns={config.layout.columns}
          gap={config.layout.gap}
          layoutType={config.layout.type}
        >
          {sampleData.map(renderCard)}
        </GalleryGrid>
      </GalleryContent>
    </GalleryContainer>
  );
}