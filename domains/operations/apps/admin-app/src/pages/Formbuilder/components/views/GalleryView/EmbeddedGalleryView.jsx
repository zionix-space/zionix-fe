import React from "react";
import { Card, Avatar, Tag, Space, Button } from "antd";

import styled from "styled-components";
// import { theme } from "../../../../styles/theme"; // Removed problematic import

const GalleryContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

const GalleryToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  margin-bottom: 12px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const GalleryCard = styled(Card)`
  .ant-card-body {
    padding: 12px;
  }

  .ant-card-cover {
    margin: 0;
  }

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const CardTitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
`;

/**
 * Embedded Gallery View Component for Form Builder
 * Displays a compact gallery view that can be embedded within a form section
 */
export function EmbeddedGalleryView({
  config,
  isPreview = false,
}) {
  // Sample images for preview
  const sampleImages = [
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400",
  ];

  // Generate sample data for preview
  const generateSampleData = () => {
    const data = [];
    for (let i = 1; i <= 6; i++) {
      data.push({
        id: i,
        title: `Item ${i}`,
        image: sampleImages[i % sampleImages.length],
        status: ["Draft", "In Progress", "Completed", "Approved"][
          Math.floor(Math.random() * 4)
        ],
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
    }
    return data;
  };

  const sampleData = generateSampleData();
  const columns = config?.layout?.columns || 3;

  return (
    <GalleryContainer>
      <GalleryToolbar>
        <Space>
          <Button size="small" icon={<i className="ri-apps-line" style={{ fontSize: 14 }} />} />
          <Button size="small" icon={<i className="ri-list-unordered" style={{ fontSize: 14 }} />} />
        </Space>

        <Button type="primary" size="small" icon={<i className="ri-add-line" style={{ fontSize: 14 }} />}>
          Add Item
        </Button>
      </GalleryToolbar>

      <GalleryGrid columns={columns}>
        {sampleData.map((item) => (
          <GalleryCard
            key={item.id}
            cover={item.image ? <CardImage src={item.image} alt={item.title} /> : null}
            hoverable
          >
            <CardTitle>{item.title}</CardTitle>
            <Tag
              color={
                item.status === "Approved"
                  ? "success"
                  : item.status === "Completed"
                  ? "success"
                  : item.status === "In Progress"
                  ? "processing"
                  : "default"
              }
            >
              {item.status}
            </Tag>
            <CardMeta>
              <span>{item.date}</span>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<i className="ri-eye-line" style={{ fontSize: 12 }} />}
                  style={{ padding: "0", height: "auto" }}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<i className="ri-edit-line" style={{ fontSize: 12 }} />}
                  style={{ padding: "0", height: "auto" }}
                />
              </Space>
            </CardMeta>
          </GalleryCard>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
}