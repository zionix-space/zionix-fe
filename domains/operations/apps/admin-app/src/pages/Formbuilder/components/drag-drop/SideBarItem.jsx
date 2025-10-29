import React, { memo, useState } from "react";
import { useDrag } from "react-dnd";
import { Tooltip } from "antd";
import { SIDEBAR_ITEM } from "../../constants";
import * as S from "../../styles/components";
import {
  EditOutlined,
  FileOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  SwitcherOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  LinkOutlined,
  BgColorsOutlined,
  MessageOutlined,
  SwapOutlined,
  BranchesOutlined,
  UploadOutlined,
  PictureOutlined,
  UserOutlined,
  TableOutlined,
  OrderedListOutlined,
  PartitionOutlined,
  LineOutlined,
  StarOutlined,
  TagOutlined,
  InboxOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  LoadingOutlined,
  HomeOutlined,
  MenuOutlined,
  StepForwardOutlined,
  MinusOutlined,
  BorderOutlined,
  ControlOutlined,
  FontSizeOutlined,
  AppstoreOutlined,
  HolderOutlined,
} from "@ant-design/icons";

// Component icons mapping based on Lowcode field types using Ant Design icons
const getComponentIcon = (type) => {
  const iconMap = {
    // Basic fields
    input: <EditOutlined />,
    textarea: <FileOutlined />,
    number: <CalculatorOutlined />,
    date: <CalendarOutlined />,
    select: <UnorderedListOutlined />,
    radio: <CheckCircleOutlined />,
    checkbox: <CheckSquareOutlined />,
    switch: <SwitcherOutlined />,
    timepicker: <ClockCircleOutlined />,

    // Advanced fields
    autocomplete: <SearchOutlined />,
    cascader: <LinkOutlined />,
    colorpicker: <BgColorsOutlined />,
    mentions: <MessageOutlined />,
    transfer: <SwapOutlined />,
    treeselect: <BranchesOutlined />,

    // File & Media
    upload: <UploadOutlined />,
    image: <PictureOutlined />,
    avatar: <UserOutlined />,

    // Data lookup
    calendar: <CalendarOutlined />,
    table: <TableOutlined />,
    list: <OrderedListOutlined />,
    tree: <BranchesOutlined />,
    descriptions: <PartitionOutlined />,

    // Widget
    slider: <LineOutlined />,
    rate: <StarOutlined />,
    badge: <TagOutlined />,
    carousel: <PictureOutlined />,
    empty: <InboxOutlined />,
    tag: <TagOutlined />,
    timeline: <HistoryOutlined />,
    alert: <ExclamationCircleOutlined />,
    progress: <DashboardOutlined />,
    skeleton: <LoadingOutlined />,
    spin: <LoadingOutlined />,
    breadcrumb: <HomeOutlined />,
    menu: <MenuOutlined />,
    pagination: <StepForwardOutlined />,
    steps: <StepForwardOutlined />,
    divider: <MinusOutlined />,
    space: <BorderOutlined />,
    button: <ControlOutlined />,
    typography: <FontSizeOutlined />,
  };

  return iconMap[type] || <AppstoreOutlined />;
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
          <HolderOutlined />
        </div>
      </div>
    </Tooltip>
  );
});

SideBarItem.displayName = "SideBarItem";

export default SideBarItem;
