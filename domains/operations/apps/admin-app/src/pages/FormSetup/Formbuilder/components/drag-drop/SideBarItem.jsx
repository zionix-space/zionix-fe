import React, { memo, useState } from "react";
import { useDrag } from "react-dnd";
import { Tooltip } from "antd";
import { SIDEBAR_ITEM } from "../../constants";
import * as S from "../../styles/components";


// Component icons mapping based on Lowcode field types using Ant Design icons
const getComponentIcon = (type) => {
  const iconMap = {
    // Basic fields
    input: <i className="ri-edit-line" />,
    textarea: <i className="ri-file-text-line" />,
    number: <i className="ri-calculator-line" />,
    date: <i className="ri-calendar-line" />,
    select: <i className="ri-list-unordered" />,
    radio: <i className="ri-radio-button-line" />,
    checkbox: <i className="ri-checkbox-line" />,
    switch: <i className="ri-toggle-line" />,
    timepicker: <i className="ri-time-line" />,

    // Advanced fields
    autocomplete: <i className="ri-search-line" />,
    cascader: <i className="ri-link" />,
    colorpicker: <i className="ri-palette-line" />,
    mentions: <i className="ri-message-line" />,
    transfer: <i className="ri-arrow-left-right-line" />,
    treeselect: <i className="ri-node-tree" />,

    // File & Media
    upload: <i className="ri-upload-line" />,
    image: <i className="ri-image-line" />,
    avatar: <i className="ri-user-line" />,

    // Data lookup
    calendar: <i className="ri-calendar-line" />,
    table: <i className="ri-table-line" />,
    list: <i className="ri-list-ordered" />,
    tree: <i className="ri-node-tree" />,
    descriptions: <i className="ri-layout-grid-line" />,

    // Widget
    slider: <i className="ri-slider-line" />,
    rate: <i className="ri-star-line" />,
    badge: <i className="ri-price-tag-line" />,
    carousel: <i className="ri-slideshow-line" />,
    empty: <i className="ri-inbox-line" />,
    tag: <i className="ri-price-tag-line" />,
    timeline: <i className="ri-history-line" />,
    alert: <i className="ri-error-warning-line" />,
    progress: <i className="ri-dashboard-line" />,
    skeleton: <i className="ri-loader-line" />,
    spin: <i className="ri-loader-line" />,
    breadcrumb: <i className="ri-home-line" />,
    menu: <i className="ri-menu-line" />,
    pagination: <i className="ri-skip-forward-line" />,
    steps: <i className="ri-skip-forward-line" />,
    divider: <i className="ri-subtract-line" />,
    space: <i className="ri-layout-line" />,
    button: <i className="ri-cursor-line" />,
    typography: <i className="ri-font-size" />,
  };

  return iconMap[type] || <i className="ri-apps-line" />;
};

const SideBarItem = memo(({ component }) => {
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: SIDEBAR_ITEM,
    item: {
      type: SIDEBAR_ITEM,
      component: component,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Tooltip
      title={`${component.content} - Drag to add to form`}
      placement="right"
      mouseEnterDelay={0.5}
    >
      <div
        ref={drag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          margin: "1px 0",
          borderRadius: "6px",
          border: "1px solid transparent",
          opacity: isDragging ? 0.5 : 1,
          cursor: isDragging ? "grabbing" : "grab",
          transform:
            isHovered && !isDragging ? "translateX(2px)" : "translateX(0)",
          transition: "all 0.2s ease",
          backgroundColor: isHovered ? "#ffffff" : "transparent",
          borderColor: isHovered ? "#dfe1e6" : "transparent",
          boxShadow: isHovered ? "0 2px 4px rgba(0, 0, 0, 0.08)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            marginRight: "10px",
            color: isHovered ? "#172b4d" : "#5e6c84",
            transition: "color 0.2s ease",
            fontSize: "14px",
          }}
        >
          {getComponentIcon(component.type)}
        </div>
        <div
          style={{
            flex: 1,
            fontSize: "13px",
            color: isHovered ? "#172b4d" : "#42526e",
            fontWeight: "500",
            transition: "all 0.2s ease",
            lineHeight: "1.3",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {component.content}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            color: "#8993a4",
            opacity: isHovered ? 0.9 : 0.5,
            transition: "opacity 0.2s ease",
            fontSize: "12px",
          }}
        >
          <i className="ri-drag-move-line" />
        </div>
      </div>
    </Tooltip>
  );
});

SideBarItem.displayName = "SideBarItem";

export default SideBarItem;
