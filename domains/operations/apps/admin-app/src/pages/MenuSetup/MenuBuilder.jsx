import React, { useState } from 'react';
import { Layout, theme, Button, Space } from 'antd';
import MenuViewer from './components/MenuPreview';
import { useStyles } from './styles/MenuBuilder.style';

const { Content } = Layout;

const MenuBuilder = () => {
  const { token } = theme.useToken();
  const styles = useStyles(token);

  const [previewMode, setPreviewMode] = useState('desktop');

  return (
    <Layout style={styles.layoutContainer}>
      {/* Main Content - Only MenuPreview */}
      <Content>
        <Space style={styles.spaceContainer}>
          <i
            className="ri-smartphone-line"
            onClick={() => setPreviewMode('mobile')}
          />
          <i
            className="ri-tablet-line"
            onClick={() => setPreviewMode('tablet')}
          />
          <i
            className="ri-computer-line"
            onClick={() => setPreviewMode('desktop')}
          />
        </Space>
        <MenuViewer previewMode={previewMode} />
      </Content>
    </Layout>
  );
};

export default MenuBuilder;
