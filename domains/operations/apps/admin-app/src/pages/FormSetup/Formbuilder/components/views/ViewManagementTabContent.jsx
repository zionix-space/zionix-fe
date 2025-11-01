import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, Button, Input, Select, Row, Col, Space, Typography, Statistic, Modal, message, Tag } from 'antd';

import ViewManager from './ViewManager';
import ViewRenderer from './ViewRenderer';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const ViewManagementTabContent = ({ 
  sections, 
  components, 
  setSections, 
  setComponents, 
  saveToHistory,
  targetSectionId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showViewManager, setShowViewManager] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [editingView, setEditingView] = useState(null);
  const [selectedViewType, setSelectedViewType] = useState(null);
  const [views, setViews] = useState([]);
  
  // Load views from sections on component mount
  useEffect(() => {
    const existingViews = [];
    if (sections && Array.isArray(sections)) {
      sections.forEach(section => {
        if (section.layout && Array.isArray(section.layout)) {
          section.layout.forEach(row => {
            if (row.type === 'row' && row.children && Array.isArray(row.children)) {
              row.children.forEach(column => {
                if (column.type === 'column' && column.children && Array.isArray(column.children)) {
                  column.children.forEach(component => {
                    if (component.type === 'component' && components && components[component.id]) {
                      const comp = components[component.id];
                      if ((comp.type === 'view' || comp.type === 'embedded_view') && comp.viewConfig) {
                        existingViews.push({
                          id: comp.id,
                          name: comp.viewConfig.name || 'Unnamed View',
                          type: comp.viewConfig.type,
                          config: comp.viewConfig.config,
                          description: comp.viewConfig.description,
                          createdAt: comp.viewConfig.createdAt,
                          updatedAt: comp.viewConfig.updatedAt,
                          status: comp.viewConfig.status || 'active',
                          sectionId: section.id
                        });
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    setViews(existingViews);
  }, [sections, components]);

  // Filter views based on search term and type
  const filteredViews = useMemo(() => {
    return views.filter(view => {
      const matchesSearch = view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (view.description && view.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || view.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [views, searchTerm, filterType]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = views.length;
    const byType = views.reduce((acc, view) => {
      acc[view.type] = (acc[view.type] || 0) + 1;
      return acc;
    }, {});
    const active = views.filter(view => view.status === 'active').length;
    
    return { total, byType, active };
  }, [views]);

  // Handle creating a new view
  const handleCreateView = useCallback((viewType = null) => {
    setEditingView(null);
    setSelectedViewType(viewType);
    setShowViewManager(true);
  }, []);

  // Handle editing a view
  const handleEditView = useCallback((view) => {
    setEditingView(view);
    setSelectedViewType(null);
    setShowViewManager(true);
  }, []);

  // Handle view creation/update from ViewManager
  const handleViewCreated = useCallback((newView, updatedViews) => {
    // Update local views state
    setViews(updatedViews);
    setShowViewManager(false);
    
    // If this is a new view (not editing), add it to a section
    if (!editingView) {
      // Ensure sections is an array
      const currentSections = sections && Array.isArray(sections) ? sections : [];
      
      // Find the target section based on targetSectionId or default to first section
      let targetSection = targetSectionId 
        ? currentSections.find(section => section.id === targetSectionId) || currentSections[0]
        : currentSections[0];
      if (!targetSection) {
        targetSection = {
          id: `section-${Date.now()}`,
          title: 'Views Section',
          description: 'Section containing views',
          layout: []
        };
        setSections([targetSection]);
        return; // Exit early since we just created the section
      }
      
      // Generate unique IDs
      const componentId = newView.id;
      const rowId = `row-${Date.now()}`;
      const columnId = `col-${Date.now()}`;
      
      // Add the view as a component to the components object
      const viewComponent = {
        id: componentId,
        name: newView.name || 'View',
        type: 'view',
        content: newView.name || 'View',
        label: newView.name || 'View',
        viewConfig: newView,
        styling: {
          width: '100%',
          height: 'auto',
          margin: '10px 0'
        }
      };
      
      // Update components object
      const updatedComponents = {
        ...components,
        [componentId]: viewComponent
      };
      
      // Add to the first row, first column, or create them if they don't exist using array format
      const updatedSections = currentSections.map(section => {
        if (section.id === targetSection.id) {
          const updatedSection = { ...section };
          if (!updatedSection.layout || !Array.isArray(updatedSection.layout) || updatedSection.layout.length === 0) {
            // Create new layout with row, column, and component
            updatedSection.layout = [{
              type: 'row',
              id: rowId,
              children: [{
                type: 'column',
                id: columnId,
                children: [{
                  type: 'component',
                  id: componentId
                }]
              }]
            }];
          } else {
            // Add to existing layout
            const firstRow = updatedSection.layout[0];
            if (firstRow && firstRow.type === 'row' && firstRow.children && Array.isArray(firstRow.children)) {
              const firstColumn = firstRow.children[0];
              if (firstColumn && firstColumn.type === 'column' && firstColumn.children && Array.isArray(firstColumn.children)) {
                // Add to existing column
                firstColumn.children.push({
                  type: 'component',
                  id: componentId
                });
              } else {
                // Create new column
                firstRow.children.push({
                  type: 'column',
                  id: columnId,
                  children: [{
                    type: 'component',
                    id: componentId
                  }]
                });
              }
            } else {
              // Create new row
              updatedSection.layout.push({
                type: 'row',
                id: rowId,
                children: [{
                  type: 'column',
                  id: columnId,
                  children: [{
                    type: 'component',
                    id: componentId
                  }]
                }]
              });
            }
          }
          return updatedSection;
        }
        return section;
      });
      
      setSections(updatedSections);
      setComponents(updatedComponents);
    } else {
      // Update existing view in components
      const updatedComponents = {
        ...components,
        [editingView.id]: {
          ...components[editingView.id],
          viewConfig: newView,
          name: newView.name || 'View',
          content: newView.name || 'View',
          label: newView.name || 'View'
        }
      };
      
      setComponents(updatedComponents);
    }
    
    // Save to history for undo/redo
    if (saveToHistory) {
      saveToHistory();
    }
  }, [sections, setSections, saveToHistory, editingView, targetSectionId, components, setComponents]);

  // Handle closing ViewManager
  const handleCloseViewManager = useCallback(() => {
    setShowViewManager(false);
    setEditingView(null);
    setSelectedViewType(null);
  }, []);

  // Handle deleting a view
  const handleDeleteView = useCallback((viewId) => {
    Modal.confirm({
      title: 'Delete View',
      content: 'Are you sure you want to delete this view? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        // Remove from views state
        const updatedViews = views.filter(view => view.id !== viewId);
        setViews(updatedViews);
        
        // Remove from sections
        const currentSections = sections && Array.isArray(sections) ? sections : [];
        const updatedSections = currentSections.map(section => {
          const updatedSection = { ...section };
          if (updatedSection.layout && updatedSection.layout.rows && Array.isArray(updatedSection.layout.rows)) {
            updatedSection.layout.rows = updatedSection.layout.rows.map(row => ({
              ...row,
              columns: row.columns && Array.isArray(row.columns) ? row.columns.map(column => ({
                ...column,
                components: column.components && Array.isArray(column.components) ? column.components.filter(component => 
                  !(component.id === viewId && component.type === 'view')
                ) : []
              })) : []
            }));
          }
          return updatedSection;
        });
        
        setSections(updatedSections);
        message.success('View deleted successfully!');
        
        // Save to history for undo/redo
        if (saveToHistory) {
          saveToHistory();
        }
      }
    });
  }, [views, sections, setSections, saveToHistory]);

  // Handle embedding a view into form builder
  const handleEmbedView = useCallback((view) => {
    // Ensure sections is an array
    const currentSections = sections && Array.isArray(sections) ? sections : [];
    
    // Check if view is already embedded using the correct array format
    const isAlreadyEmbedded = currentSections.some(section => 
      section.layout && Array.isArray(section.layout) && 
      section.layout.some(row => 
        row.type === 'row' && row.children && Array.isArray(row.children) && 
        row.children.some(column => 
          column.type === 'column' && column.children && Array.isArray(column.children) && 
          column.children.some(component => 
            component.type === 'component' && components && components[component.id] && 
            (components[component.id].type === 'view' || components[component.id].type === 'embedded_view')
          )
        )
      )
    );
    
    if (isAlreadyEmbedded) {
      message.warning(`${view.name} is already embedded in the form!`);
      return;
    }
    
    // Generate unique IDs
    const componentId = `embedded-${view.id}-${Date.now()}`;
    const rowId = `row-${Date.now()}`;
    const columnId = `col-${Date.now()}`;
    
    // Create view component in the components object
    const viewComponent = {
      id: componentId,
      name: view.name || 'Embedded View',
      type: 'embedded_view',
      content: view.name || 'Embedded View',
      label: view.name || 'Embedded View',
      viewConfig: view,
      styling: {
        width: '100%',
        height: 'auto',
        margin: '10px 0'
      }
    };
    
    // Update components object
    const updatedComponents = {
      ...components,
      [componentId]: viewComponent
    };
    
    // Find the target section based on targetSectionId or default to first section
    let targetSection = targetSectionId 
      ? currentSections.find(section => section.id === targetSectionId) || currentSections[0]
      : currentSections[0];
    let updatedSections;
    
    if (!targetSection) {
      // Create new section with the embedded view
      targetSection = {
        id: `section-${Date.now()}`,
        title: 'Views Section',
        description: 'Section containing embedded views',
        layout: [{
          type: 'row',
          id: rowId,
          children: [{
            type: 'column',
            id: columnId,
            children: [{
              type: 'component',
              id: componentId
            }]
          }]
        }]
      };
      updatedSections = [targetSection];
    } else {
      // Add to existing sections
      updatedSections = currentSections.map(section => {
      if (section.id === targetSection.id) {
        const updatedSection = { ...section };
        if (!updatedSection.layout || !Array.isArray(updatedSection.layout) || updatedSection.layout.length === 0) {
          // Create new layout with row, column, and component
          updatedSection.layout = [{
            type: 'row',
            id: rowId,
            children: [{
              type: 'column',
              id: columnId,
              children: [{
                type: 'component',
                id: componentId
              }]
            }]
          }];
        } else {
          // Add to existing layout
          const firstRow = updatedSection.layout[0];
          if (firstRow && firstRow.type === 'row' && firstRow.children && Array.isArray(firstRow.children)) {
            const firstColumn = firstRow.children[0];
            if (firstColumn && firstColumn.type === 'column' && firstColumn.children && Array.isArray(firstColumn.children)) {
              // Add to existing column
              firstColumn.children.push({
                type: 'component',
                id: componentId
              });
            } else {
              // Create new column
              firstRow.children.push({
                type: 'column',
                id: columnId,
                children: [{
                  type: 'component',
                  id: componentId
                }]
              });
            }
          } else {
            // Create new row
            updatedSection.layout.push({
              type: 'row',
              id: rowId,
              children: [{
                type: 'column',
                id: columnId,
                children: [{
                  type: 'component',
                  id: componentId
                }]
              }]
            });
          }
        }
        return updatedSection;
      }
      return section;
    });
    }
    
    setSections(updatedSections);
    setComponents(updatedComponents);
    message.success(`${view.name} embedded into form builder!`);
    
    // Save to history for undo/redo
    if (saveToHistory) {
      saveToHistory();
    }
  }, [sections, setSections, components, setComponents, saveToHistory, targetSectionId]);

  // Helper function to get view type color
  const getViewTypeColor = (type) => {
    const colors = {
      gallery: 'blue',
      list: 'green', 
      sheet: 'orange',
      datatable: 'purple'
    };
    return colors[type] || 'default';
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {!showViewManager ? (
        <>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={2}>View Management</Title>
            <Text type="secondary">
              Create, edit, and manage views for your form. Views help organize and display your data in different formats.
            </Text>
          </div>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card>
                <Statistic title="Total Views" value={statistics.total} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Active Views" value={statistics.active} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Gallery Views" value={statistics.byType.gallery || 0} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="List Views" value={statistics.byType.list || 0} />
              </Card>
            </Col>
          </Row>

          {/* Controls */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Space size="middle">
                  <Search
                    placeholder="Search views..."
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<i className="ri-search-line" />}
                  />
                  <Select
                    value={filterType}
                    onChange={setFilterType}
                    style={{ width: 150 }}
                  >
                    <Option value="all">All Types</Option>
                    <Option value="gallery">Gallery</Option>
                    <Option value="list">List</Option>
                    <Option value="sheet">Sheet</Option>
                    <Option value="datatable">Data Table</Option>
                  </Select>
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<i className="ri-add-line" />}
                    onClick={() => handleCreateView()}
                    size="large"
                  >
                    Create New View
                  </Button>
                  <Button 
                    icon={<i className="ri-add-line" />}
                    onClick={() => handleCreateView('gallery')}
                  >
                    Gallery
                  </Button>
                  <Button 
                    icon={<i className="ri-add-line" />}
                    onClick={() => handleCreateView('list')}
                  >
                    List
                  </Button>
                  <Button 
                    icon={<i className="ri-add-line" />}
                    onClick={() => handleCreateView('sheet')}
                  >
                    Sheet
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Views Grid */}
          <Row gutter={[16, 16]}>
            {filteredViews.length > 0 ? (
              filteredViews.map(view => (
                <Col xs={24} sm={12} md={8} lg={6} key={view.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button 
                        icon={<i className="ri-eye-line" />} 
                        onClick={() => setSelectedView(view)}
                        size="small"
                        title="Preview view"
                      >
                        Preview
                      </Button>,
                      <Button 
                        icon={<i className="ri-edit-line" />} 
                        onClick={() => handleEditView(view)}
                        size="small"
                        title="Edit view"
                      >
                        Edit
                      </Button>,
                      <Button 
                        type="primary" 
                        icon={<i className="ri-apps-2-add-line" />}
                        onClick={() => handleEmbedView(view)}
                        size="small"
                        title="Embed view into form"
                      >
                        Embed
                      </Button>,
                      <Button 
                        danger 
                        icon={<i className="ri-delete-bin-line" />} 
                        onClick={() => handleDeleteView(view.id)}
                        size="small"
                        title="Delete view"
                      >
                        Delete
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={view.name}
                      description={
                        <div>
                          <Space>
                            <Tag color={getViewTypeColor(view.type)}>{view.type}</Tag>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {view.status === 'active' ? 'Active' : 'Inactive'}
                            </Text>
                          </Space>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Created: {new Date(view.createdAt).toLocaleDateString()}
                          </Text>
                          {view.description && (
                            <>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {view.description}
                              </Text>
                            </>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card style={{ textAlign: 'center', padding: '48px' }}>
                  <Title level={4} type="secondary">No Views Found</Title>
                  <Text type="secondary">
                    {views.length === 0 
                      ? "You haven't created any views yet. Click 'Create New View' to get started."
                      : "No views match your current search criteria."
                    }
                  </Text>
                  {views.length === 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <Button 
                        type="primary" 
                        icon={<i className="ri-add-line" />}
                        onClick={() => handleCreateView()}
                        size="large"
                      >
                        Create Your First View
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            )}
          </Row>

          {/* Preview Modal */}
          <Modal
            title={selectedView ? `Preview: ${selectedView.name}` : 'View Preview'}
            open={!!selectedView}
            onCancel={() => setSelectedView(null)}
            footer={[
              <Button key="close" onClick={() => setSelectedView(null)}>
                Close
              </Button>,
              <Button 
                key="edit" 
                type="primary" 
                onClick={() => {
                  handleEditView(selectedView);
                  setSelectedView(null);
                }}
              >
                Edit View
              </Button>
            ]}
            width={800}
          >
            {selectedView && (
              <ViewRenderer
                view={selectedView}
                data={[]} // You might want to pass sample data here
                components={components}
              />
            )}
          </Modal>
        </>
      ) : (
        <ViewManager
          onBack={handleCloseViewManager}
          onViewCreated={handleViewCreated}
          formSchema={{ 
            id: 'form-builder-schema',
            title: 'Form Builder',
            components: components,
            sections: sections
          }}
          existingViews={views}
          editingView={editingView}
          selectedViewType={selectedViewType}
          onViewSelect={(view) => {
            setSelectedView(view);
            setShowViewManager(false);
          }}
        />
      )}
    </div>
  );
};

export default ViewManagementTabContent;