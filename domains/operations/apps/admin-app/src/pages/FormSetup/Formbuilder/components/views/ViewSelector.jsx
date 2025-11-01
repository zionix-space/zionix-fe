import React, { useState, useEffect } from "react";
import { Button, Card, Empty, Input, Space, Typography, Tag, Tooltip } from "antd";

import styled from "styled-components";

const { Title, Text } = Typography;
const { Search } = Input;

const ViewSelectorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  padding: 24px;
  background: #f8f9fa;
  overflow-y: auto;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  box-shadow: none;
  padding: 8px 16px;
  height: auto;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ViewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const ViewCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    transform: translateY(-2px);
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const ViewIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  
  &.gallery {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.list {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
  
  &.sheet {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }
  
  &.permission {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
  }
`;

const CreateNewSection = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #d9d9d9;
  margin-top: 20px;
`;

const ViewSelector = ({ onBack, onSelectView, onCreateView, onEditView, availableViews = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // Use provided views or default empty array
  const existingViews = availableViews;

  const viewTypes = {
    gallery: {
      icon: <i className="ri-apps-line" />,
      name: "Gallery View",
      description: "Card-based layout perfect for visual content",
    },
    list: {
      icon: <i className="ri-list-unordered" />,
      name: "List View",
      description: "Table format ideal for structured data",
    },
    sheet: {
      icon: <i className="ri-table-line" />,
      name: "Sheet View",
      description: "Spreadsheet-style interface for data manipulation",
    },
    permission: {
      icon: <i className="ri-shield-check-line" />,
      name: "Permission View",
      description: "Manage user permissions and access controls",
    },
  };

  const filteredViews = existingViews.filter(view =>
    view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    view.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSelect = (view) => {
    onSelectView(view);
  };

  const handleCreateNew = (viewType) => {
    onCreateView(viewType);
  };

  return (
    <ViewSelectorContainer>
      <HeaderSection>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <BackButton onClick={onBack}>
            <i className="ri-arrow-left-line" />
            Back to Form Builder
          </BackButton>
          <div>
            <Title level={3} style={{ margin: 0 }}>Select a View</Title>
            <Text type="secondary">Choose an existing view or create a new one</Text>
          </div>
        </div>
        <Search
          placeholder="Search views..."
          prefix={<i className="ri-search-line" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </HeaderSection>

      {filteredViews.length > 0 && (
        <>
          <Title level={4} style={{ marginBottom: "16px" }}>Available Views</Title>
          <ViewGrid>
            {filteredViews.map((view) => (
              <ViewCard
                key={view.id}
                onClick={() => handleViewSelect(view)}
                actions={[
                  <Space key="actions">
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => onSelectView(view)}
                    >
                      Select
                    </Button>
                    {onEditView && (
                      <Button 
                        size="small"
                        onClick={() => onEditView(view)}
                      >
                        Edit
                      </Button>
                    )}
                  </Space>
                ]}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <ViewIcon className={view.type}>
                    {viewTypes[view.type]?.icon}
                  </ViewIcon>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Title level={5} style={{ margin: 0 }}>{view.name}</Title>
                      <Tag color={view.status === "active" ? "green" : "orange"}>
                        {view.status}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: "13px", lineHeight: "1.4" }}>
                      {view.description}
                    </Text>
                    <div style={{ marginTop: "12px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Modified {view.lastModified}
                      </Text>
                    </div>
                  </div>
                </div>
              </ViewCard>
            ))}
          </ViewGrid>
        </>
      )}

      <CreateNewSection>
        <Title level={4} style={{ marginBottom: "16px" }}>Create New View</Title>
        <Text type="secondary" style={{ display: "block", marginBottom: "24px" }}>
          Start with a template or build from scratch
        </Text>
        <Space size="large" wrap>
          {Object.entries(viewTypes).map(([type, config]) => (
            <Card
              key={type}
              hoverable
              style={{ width: 200, textAlign: "center" }}
              onClick={() => handleCreateNew(type)}
            >
              <ViewIcon className={type} style={{ margin: "0 auto 12px" }}>
                {config.icon}
              </ViewIcon>
              <Title level={5} style={{ margin: "0 0 8px 0" }}>{config.name}</Title>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {config.description}
              </Text>
            </Card>
          ))}
        </Space>
      </CreateNewSection>

      {filteredViews.length === 0 && searchTerm && (
        <Empty
          description={`No views found for "${searchTerm}"`}
          style={{ marginTop: "40px" }}
        >
          <Button type="primary" onClick={() => setSearchTerm("")}>
            Clear Search
          </Button>
        </Empty>
      )}
    </ViewSelectorContainer>
  );
};

export default ViewSelector;