import React, { useState } from 'react';
import { theme, Space } from 'antd';
import MenuViewer from './components/MenuPreview';
import { useStyles } from './styles/MenuBuilder.style';

const MenuBuilder = () => {
  const { token } = theme.useToken();
  const styles = useStyles(token);

  const [previewMode, setPreviewMode] = useState('desktop');

  return (
    <div style={styles.layoutContainer}>
      {/* Top Controls */}
      <div style={styles.topControls}>
        <Space style={styles.spaceContainer}>
          <i
            className="ri-smartphone-line"
            onClick={() => setPreviewMode('mobile')}
            style={styles.deviceIcon}
          />
          <i
            className="ri-tablet-line"
            onClick={() => setPreviewMode('tablet')}
            style={styles.deviceIcon}
          />
          <i
            className="ri-computer-line"
            onClick={() => setPreviewMode('desktop')}
            style={styles.deviceIcon}
          />
        </Space>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <MenuViewer previewMode={previewMode} />
      </div>
    </div>
  );
};

export default MenuBuilder;
