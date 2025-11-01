import React, { useState, useCallback } from 'react';
import { Layout, theme } from 'antd';
import { useMenuStore } from '../../stores/menu/useMenuStore';
import MenuBuilderTopBar from './components/MenuBuilderTopBar';
import MenuBuilderSidebar from './components/MenuBuilderSidebar';
import MenuTreeEditor from './components/MenuTreeEditor';
import MenuPreview from './components/MenuPreview';
import { useStyles } from './styles/MenuBuilder.style';

const { Content } = Layout;

const MenuBuilder = () => {
  const { token } = theme.useToken();
  const styles = useStyles(token);
  
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  
  const {
    completeMenuData,
    mainMenus,
    sidebarMenus,
    setCompleteMenuData,
    setMainMenus,
    setSidebarMenus,
    menuVersion,
    setMenuVersion
  } = useMenuStore();

  // Handle menu data changes and trigger live preview updates
  const handleMenuDataChange = useCallback((newMenuData) => {
    setCompleteMenuData(newMenuData);
    setMenuVersion(menuVersion + 1);
  }, [setCompleteMenuData, setMenuVersion, menuVersion]);

  const handleMainMenusChange = useCallback((newMainMenus) => {
    setMainMenus(newMainMenus);
    setMenuVersion(menuVersion + 1);
  }, [setMainMenus, setMenuVersion, menuVersion]);

  const handleSidebarMenusChange = useCallback((newSidebarMenus) => {
    setSidebarMenus(newSidebarMenus);
    setMenuVersion(menuVersion + 1);
  }, [setSidebarMenus, setMenuVersion, menuVersion]);

  return (
    <Layout style={styles.layoutContainer}>
      {/* Top Bar */}
      <MenuBuilderTopBar 
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        isPreviewVisible={isPreviewVisible}
        setIsPreviewVisible={setIsPreviewVisible}
      />
      
      <Layout style={styles.contentLayout}>
        {/* Sidebar */}
        <MenuBuilderSidebar 
          selectedMenuId={selectedMenuId}
          setSelectedMenuId={setSelectedMenuId}
        />
        
        {/* Main Content Area */}
        <Content style={styles.mainContent}>
          <div style={styles.contentContainer}>
            {/* Menu Tree Editor */}
            <div style={styles.editorSection}>
              <MenuTreeEditor
                selectedMenuId={selectedMenuId}
                onMenuDataChange={handleMenuDataChange}
                onMainMenusChange={handleMainMenusChange}
                onSidebarMenusChange={handleSidebarMenusChange}
              />
            </div>
            
            {/* Live Preview */}
            {isPreviewVisible && (
              <div style={styles.previewSection}>
                <MenuPreview
                  previewMode={previewMode}
                  menuData={completeMenuData}
                  mainMenus={mainMenus}
                  sidebarMenus={sidebarMenus}
                />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MenuBuilder;