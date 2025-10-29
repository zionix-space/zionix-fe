import React, { memo } from 'react';
import { Alert, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Column warning information component
const ColumnWarningInfo = memo(() => {
  return (
    <Alert
      message="Column Layout Guidelines"
      description={
        <div style={{ marginTop: '8px' }}>
          <Text>
            <InfoCircleOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
            <strong>Best Practices:</strong>
          </Text>
          <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
            <li>
              <Text>Use <strong>1-3 columns</strong> for optimal user experience</Text>
            </li>
            <li>
              <Text><strong>4+ columns</strong> may appear cramped on smaller screens</Text>
            </li>
            <li>
              <Text>Consider mobile responsiveness when designing layouts</Text>
            </li>
            <li>
              <Text>You can still create more columns if needed for your specific use case</Text>
            </li>
          </ul>
          <div style={{ marginTop: '12px', padding: '8px', background: '#f6ffed', borderRadius: '4px', border: '1px solid #b7eb8f' }}>
            <Text style={{ fontSize: '12px', color: '#52c41a' }}>
              ✅ <strong>Column reordering is now fully enabled!</strong> You can move columns between any rows.
            </Text>
          </div>
        </div>
      }
      type="info"
      showIcon
      style={{
        margin: '16px 0',
        borderRadius: '6px',
        border: '1px solid #d9d9d9'
      }}
    />
  );
});

// Set display name for debugging
ColumnWarningInfo.displayName = 'ColumnWarningInfo';

export default ColumnWarningInfo;
