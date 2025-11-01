import React from "react";
import { Card, Button, Space, Typography, Tag } from "antd";

import { GalleryPreview } from "./GalleryView/GalleryPreview";
import { ListViewPreview } from "./ListView/ListViewPreview";
import { SheetViewPreview } from "./SheetView/SheetViewPreview";
import styled from "styled-components";
import { colors, elevation } from "../../styles/theme";

const { Title, Text } = Typography;

const ViewContainer = styled.div`
  margin: 16px 0;
  border: 1px solid ${colors.gray30};
  border-radius: 8px;
  background: #ffffff;
`;

const ViewHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.gray30};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.gray10};
`;

const ViewContent = styled.div`
  padding: 16px;
`;

const ViewRenderer = ({ 
  view, 
  onEdit, 
  onDelete, 
  onPreview,
  isPreviewMode = false 
}) => {
  const renderViewContent = () => {
    if (!view || !view.config) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <Text>No view configuration available</Text>
        </div>
      );
    }

    switch (view.type) {
      case 'gallery':
        return (
          <GalleryPreview 
            config={view.config}
            data={view.config.sampleData || []}
            isBuilder={!isPreviewMode}
          />
        );
      
      case 'list':
        return (
          <ListViewPreview 
            config={view.config}
            data={view.config.sampleData || []}
            isBuilder={!isPreviewMode}
          />
        );
      
      case 'sheet':
        return (
          <SheetViewPreview 
            config={view.config}
            data={view.config.sampleData || []}
            isBuilder={!isPreviewMode}
          />
        );
      
      case 'datatable':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <Text>DataTable View - Coming Soon</Text>
          </div>
        );
      
      default:
        return (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <Text>Unknown view type: {view.type}</Text>
          </div>
        );
    }
  };

  const getViewTypeColor = (type) => {
    switch (type) {
      case 'gallery': return 'blue';
      case 'list': return 'green';
      case 'sheet': return 'orange';
      case 'datatable': return 'purple';
      default: return 'default';
    }
  };

  return (
    <ViewContainer>
      <ViewHeader>
        <Space>
          <Title level={5} style={{ margin: 0 }}>
            {view.name || 'Untitled View'}
          </Title>
          <Tag color={getViewTypeColor(view.type)}>
            {view.type?.toUpperCase() || 'UNKNOWN'}
          </Tag>
          {view.status && (
            <Tag color={view.status === 'active' ? 'success' : 'warning'}>
              {view.status.toUpperCase()}
            </Tag>
          )}
        </Space>
        
        {!isPreviewMode && (
          <Space>
            {onPreview && (
              <Button 
                size="small" 
                icon={<i className="ri-eye-line" />}
                onClick={() => onPreview(view)}
              >
                Preview
              </Button>
            )}
            {onEdit && (
              <Button 
                size="small" 
                icon={<i className="ri-edit-line" />}
                onClick={() => onEdit(view)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                size="small" 
                danger
                icon={<i className="ri-delete-bin-line" />}
                onClick={() => onDelete(view)}
              >
                Delete
              </Button>
            )}
          </Space>
        )}
      </ViewHeader>
      
      <ViewContent>
        {renderViewContent()}
      </ViewContent>
    </ViewContainer>
  );
};

export default ViewRenderer;