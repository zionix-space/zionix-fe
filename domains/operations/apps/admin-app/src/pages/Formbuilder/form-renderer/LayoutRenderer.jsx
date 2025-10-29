import React, { memo, useCallback, useMemo, useState } from "react";
import { Row, Col, Tabs, Collapse, Button, Steps, Timeline, Card, Divider } from "antd";
import ComponentRenderer from "./ComponentRenderer";

const { Panel } = Collapse;
const { Step } = Steps;

// Memoized LayoutRenderer for better performance
const LayoutRenderer = memo(
  ({ layout, sections, components, formInstance, onValuesChange, layoutType = 'single' }) => {
    // State for interactive layouts
    const [currentStep, setCurrentStep] = useState(0);
    const [activeAccordionKeys, setActiveAccordionKeys] = useState(['0']);
    const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);
    // Memoized component renderer for better performance
    const renderComponent = useCallback(
      (componentData) => {
        if (!componentData || !componentData.id) {
          return null;
        }

        // Container components removed

        const component = components[componentData.id];
        if (!component) {
          return (
            <div style={{ color: "red", padding: "8px" }}>
              Component not found: {componentData.id}
            </div>
          );
        }

        return (
          <ComponentRenderer
            key={componentData.id}
            component={component}
            formInstance={formInstance}
          />
        );
      },
      [components, formInstance]
    );

    // Smart container children renderer that detects column layouts
    const renderContainerChildren = useCallback(
      (children) => {
        if (!children || children.length === 0) {
          return null;
        }

        // Check if children should be rendered as columns
        // If there are multiple components and none are rows, render as columns
        const hasRows = children.some((child) => child.type === "row");
        const shouldRenderAsColumns = children.length > 1 && !hasRows;

        if (shouldRenderAsColumns) {
          // Render as flex columns (side by side)
          return (
            <div
              style={{
                display: "flex",
                gap: "16px",
                width: "100%",
                flexWrap: "wrap", // Allow wrapping on smaller screens
              }}
            >
              {children.map((child, index) => (
                <div
                  key={child.id || index}
                  style={{
                    flex: 1,
                    minWidth: "200px", // Minimum width for responsiveness
                    maxWidth: `${100 / children.length}%`, // Equal width distribution
                  }}
                >
                  {renderComponent(child)}
                </div>
              ))}
            </div>
          );
        } else {
          // Render as vertical stack (default behavior)
          return children.map(renderComponent);
        }
      },
      [renderComponent]
    );

    // Container rendering functions removed

    // Memoized column renderer for better performance
    const renderColumn = useCallback(
      (columnData) => {
        if (!columnData || !columnData.id) {
          return null;
        }

        const children = columnData.children || [];

        // Column props calculation without useMemo inside callback
        const { key, ...colProps } = {
          key: columnData.id,
          span:
            columnData.layout?.span ||
            Math.floor(24 / (columnData.parent?.children?.length || 1)),
          offset: columnData.layout?.offset || 0,
          xs: columnData.layout?.xs,
          sm: columnData.layout?.sm,
          md: columnData.layout?.md,
          lg: columnData.layout?.lg,
          xl: columnData.layout?.xl,
          xxl: columnData.layout?.xxl,
          flex: columnData.layout?.flex,
          order: columnData.layout?.order,
          pull: columnData.layout?.pull,
          push: columnData.layout?.push,
          style: {
            padding: "8px",
            minHeight: children.length === 0 ? "60px" : "auto",
            ...columnData.styling?.style,
          },
        };

        return (
          <Col key={key} {...colProps}>
            {children.map(renderComponent)}
          </Col>
        );
      },
      [renderComponent]
    );

    // Memoized row renderer for better performance
    const renderRow = useCallback(
      (rowData) => {
        if (!rowData || !rowData.id) {
          return null;
        }

        const children = rowData.children || [];

        // Row props calculation without useMemo inside callback
        const { key, ...rowProps } = {
          key: rowData.id,
          gutter: rowData.layout?.gutter || [16, 16],
          align: rowData.layout?.align || "top",
          justify: rowData.layout?.justify || "start",
          wrap: rowData.layout?.wrap !== false,
          style: {
            marginBottom: "16px",
            ...rowData.styling?.style,
          },
        };

        // Children with parent reference for span calculation
        const childrenWithParent = children.map((child) => ({
          ...child,
          parent: rowData,
        }));

        return (
          <Row key={key} {...rowProps}>
            {childrenWithParent.map(renderColumn)}
          </Row>
        );
      },
      [renderColumn]
    );

    // Memoized container style
    const containerStyle = useMemo(() => ({ width: "100%" }), []);

    // Render section content - defined before layout functions that use it
    const renderSectionContent = useCallback(
      (sectionLayout) => {
        if (!sectionLayout || !Array.isArray(sectionLayout)) {
          return <div>No layout data available for this section</div>;
        }
        return <div style={containerStyle}>{sectionLayout.map(renderRow)}</div>;
      },
      [renderRow, containerStyle]
    );

    // Layout-specific rendering functions
    const renderStepLayout = useCallback(
      (sectionsData) => {
        
        const stepItems = sectionsData.map((section, index) => ({
          title: section.title || `Step ${index + 1}`,
          description: section.description,
        }));

        return (
          <div style={containerStyle}>
            <Steps current={currentStep} items={stepItems} style={{ marginBottom: '24px' }} />
            <div style={{ minHeight: '400px', padding: '24px', background: '#fafafa', borderRadius: '8px' }}>
              {sectionsData[currentStep] && renderSectionContent(sectionsData[currentStep].layout)}
            </div>
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button 
                style={{ marginRight: '8px' }} 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
              <Button 
                type="primary"
                disabled={currentStep === sectionsData.length - 1}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        );
      },
      [renderSectionContent, containerStyle, currentStep]
    );

    const renderAccordionLayout = useCallback(
      (sectionsData) => {
        const accordionItems = sectionsData.map((section) => ({
          key: section.id,
          label: section.title || `Section ${section.id}`,
          children: renderSectionContent(section.layout),
        }));

        return (
          <div style={containerStyle}>
            <Collapse 
              items={accordionItems} 
              activeKey={activeAccordionKeys}
              onChange={setActiveAccordionKeys}
            />
          </div>
        );
      },
      [renderSectionContent, containerStyle, activeAccordionKeys]
    );

    const renderTimelineLayout = useCallback(
      (sectionsData) => {
        const timelineItems = sectionsData.map((section, index) => ({
          children: (
            <Card title={section.title || `Step ${index + 1}`} style={{ marginBottom: '16px' }}>
              {renderSectionContent(section.layout)}
            </Card>
          ),
        }));

        return (
          <div style={containerStyle}>
            <Timeline items={timelineItems} mode="left" />
          </div>
        );
      },
      [renderSectionContent, containerStyle]
    );

    const renderDashboardLayout = useCallback(
      (sectionsData) => {
        return (
          <div style={{ ...containerStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {sectionsData.map((section) => (
              <Card 
                key={section.id}
                title={section.title || `Widget ${section.id}`}
                style={{ height: 'fit-content' }}
              >
                {renderSectionContent(section.layout)}
              </Card>
            ))}
          </div>
        );
      },
      [renderSectionContent, containerStyle]
    );

    const renderKanbanLayout = useCallback(
      (sectionsData) => {
        return (
          <div style={{ ...containerStyle, display: 'flex', gap: '16px', overflowX: 'auto' }}>
            {sectionsData.map((section) => (
              <Card 
                key={section.id}
                title={section.title || `Column ${section.id}`}
                style={{ minWidth: '300px', maxWidth: '350px' }}
                bodyStyle={{ maxHeight: '600px', overflowY: 'auto' }}
              >
                {renderSectionContent(section.layout)}
              </Card>
            ))}
          </div>
        );
      },
      [renderSectionContent, containerStyle]
    );

    const renderMatrixLayout = useCallback(
      (sectionsData) => {
        const gridCols = Math.ceil(Math.sqrt(sectionsData.length));
        return (
          <div style={{ 
            ...containerStyle, 
            display: 'grid', 
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`, 
            gap: '16px' 
          }}>
            {sectionsData.map((section) => (
              <Card 
                key={section.id}
                title={section.title || `Cell ${section.id}`}
                size="small"
              >
                {renderSectionContent(section.layout)}
              </Card>
            ))}
          </div>
        );
      },
      [renderSectionContent, containerStyle]
    );

    const renderSplitScreenLayout = useCallback(
      (sectionsData) => {
        const leftSections = sectionsData.slice(0, Math.ceil(sectionsData.length / 2));
        const rightSections = sectionsData.slice(Math.ceil(sectionsData.length / 2));

        return (
          <div style={{ ...containerStyle, display: 'flex', gap: '16px', height: '100%' }}>
            <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: '16px' }}>
              {leftSections.map((section) => (
                <div key={section.id} style={{ marginBottom: '24px' }}>
                  <h3>{section.title || `Section ${section.id}`}</h3>
                  <Divider style={{ margin: '12px 0' }} />
                  {renderSectionContent(section.layout)}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, paddingLeft: '16px' }}>
              {rightSections.map((section) => (
                <div key={section.id} style={{ marginBottom: '24px' }}>
                  <h3>{section.title || `Section ${section.id}`}</h3>
                  <Divider style={{ margin: '12px 0' }} />
                  {renderSectionContent(section.layout)}
                </div>
              ))}
            </div>
          </div>
        );
      },
      [renderSectionContent, containerStyle]
    );



    // Early return after all hooks
    if (sections && Array.isArray(sections) && sections.length > 0) {
      // Render sections based on layout type
      switch (layoutType) {
        case 'step':
          return renderStepLayout(sections);
        case 'accordion':
          return renderAccordionLayout(sections);
        case 'timeline':
          return renderTimelineLayout(sections);
        case 'dashboard':
          return renderDashboardLayout(sections);
        case 'kanban':
          return renderKanbanLayout(sections);
        case 'matrix':
          return renderMatrixLayout(sections);
        case 'split-screen':
          return renderSplitScreenLayout(sections);
        case 'tabbed':
          // Render sections using Tabs
          const sectionItems = sections.map((sectionData) => ({
            key: sectionData.id,
            label: sectionData.title || `Section ${sectionData.id}`,
            children: renderSectionContent(sectionData.layout),
          }));
          return (
            <div style={containerStyle}>
              <Tabs items={sectionItems} />
            </div>
          );
        case 'single':
        default:
          // Default single page layout - render all sections vertically
          return (
            <div style={containerStyle}>
              {sections.map((section) => (
                <div key={section.id} style={{ marginBottom: '32px' }}>
                  {section.title && (
                    <h2 style={{ marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                      {section.title}
                    </h2>
                  )}
                  {renderSectionContent(section.layout)}
                </div>
              ))}
            </div>
          );
      }
    }

    if (!layout || !Array.isArray(layout)) {
      return <div>No layout data available</div>;
    }

    return <div style={containerStyle}>{layout.map(renderRow)}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison to ensure re-render when layout, sections or components change - avoid JSON.stringify
    if (
      prevProps.formInstance !== nextProps.formInstance ||
      prevProps.onValuesChange !== nextProps.onValuesChange
    ) {
      return false;
    }

    // Compare sections if they exist
    const prevSections = prevProps.sections || [];
    const nextSections = nextProps.sections || [];

    if (prevSections.length !== nextSections.length) {
      return false;
    }

    // Compare each section
    for (let i = 0; i < prevSections.length; i++) {
      const prevSection = prevSections[i];
      const nextSection = nextSections[i];

      if (
        !nextSection ||
        prevSection.id !== nextSection.id ||
        prevSection.title !== nextSection.title
      ) {
        return false;
      }

      // Compare section layouts
      const prevSectionLayout = prevSection.layout || [];
      const nextSectionLayout = nextSection.layout || [];

      if (prevSectionLayout.length !== nextSectionLayout.length) {
        return false;
      }

      for (let j = 0; j < prevSectionLayout.length; j++) {
        if (
          prevSectionLayout[j]?.id !== nextSectionLayout[j]?.id ||
          prevSectionLayout[j]?.type !== nextSectionLayout[j]?.type ||
          prevSectionLayout[j]?.children?.length !==
            nextSectionLayout[j]?.children?.length
        ) {
          return false;
        }
      }
    }

    // Compare layout array length and structure (shallow comparison) - for backward compatibility
    const prevLayout = prevProps.layout || [];
    const nextLayout = nextProps.layout || [];

    if (prevLayout.length !== nextLayout.length) {
      return false;
    }

    // Compare layout items by ID and type only
    for (let i = 0; i < prevLayout.length; i++) {
      if (
        prevLayout[i]?.id !== nextLayout[i]?.id ||
        prevLayout[i]?.type !== nextLayout[i]?.type ||
        prevLayout[i]?.children?.length !== nextLayout[i]?.children?.length
      ) {
        return false;
      }
    }

    // Compare components object keys (shallow comparison)
    const prevComponentKeys = Object.keys(prevProps.components || {});
    const nextComponentKeys = Object.keys(nextProps.components || {});

    if (prevComponentKeys.length !== nextComponentKeys.length) {
      return false;
    }

    // Check if component keys are the same
    for (const key of prevComponentKeys) {
      if (
        !nextProps.components[key] ||
        prevProps.components[key] !== nextProps.components[key]
      ) {
        return false;
      }
    }

    return true;
  }
);

// Set display name for debugging
LayoutRenderer.displayName = "LayoutRenderer";

export default LayoutRenderer;
