import shortid from "shortid";

// Core component types
export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";

// Container components removed

// Component capabilities - defines what each component type can contain
export const COMPONENT_CAPABILITIES = {
  [ROW]: {
    canContain: [COLUMN],
    acceptsFromSidebar: false,
    isContainer: true,
    maxChildren: 12, // Bootstrap-like grid system
    minChildren: 1,
    nestingLevel: "unlimited",
    allowsRowNesting: false, // Rows cannot contain other rows directly
  },
  [COLUMN]: {
    canContain: [
      COMPONENT,
      ROW,
    ],
    acceptsFromSidebar: true,
    isContainer: true,
    maxChildren: 100, // Increased for complex forms
    minChildren: 0,
    nestingLevel: "unlimited",
    allowsRowNesting: true, // Columns can contain rows for complex layouts
  },

  [COMPONENT]: {
    canContain: [],
    acceptsFromSidebar: false,
    isContainer: false,
    maxChildren: 0,
    minChildren: 0,
    nestingLevel: "leaf",
  },


};

export const SIDEBAR_ITEMS = [
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "input",
      content: "Text Input",
      label: "Text Input",
      placeholder: "Enter text here...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "textarea",
      content: "Text Area",
      label: "Text Area",
      placeholder: "Enter multiple lines of text...",
      validation: {
        required: false,
      },
      styling: {
        rows: 4,
        allowClear: true,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "select",
      content: "Select Dropdown",
      label: "Select Option",
      placeholder: "Choose an option...",
      validation: {
        required: false,
      },
      styling: {
        allowClear: true,
        showSearch: true,
      },
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "radio",
      content: "Radio Group",
      label: "Choose One",
      validation: {
        required: false,
      },
      styling: {
        direction: "vertical",
      },
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "maybe", label: "Maybe" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "checkbox",
      content: "Checkbox",
      label: "Checkbox Option",
      text: "I agree to the terms and conditions",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "number",
      content: "Number Input",
      label: "Number",
      placeholder: "Enter a number...",
      validation: {
        required: false,
        min: 0,
        max: 100,
      },
      styling: {
        size: "middle",
        controls: true,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "date",
      content: "Date Picker",
      label: "Date",
      placeholder: "Select a date...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        format: "YYYY-MM-DD",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "switch",
      content: "Switch",
      label: "Toggle Switch",
      validation: {
        required: false,
      },
      styling: {
        size: "default",
        checkedChildren: "ON",
        unCheckedChildren: "OFF",
      },
    },
  },

  // Additional Data Entry Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "autocomplete",
      content: "AutoComplete",
      label: "Auto Complete",
      placeholder: "Type to search...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        backfill: false,
      },
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "cascader",
      content: "Cascader",
      label: "Cascader",
      placeholder: "Please select...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        showSearch: true,
        multiple: false,
      },
      options: [
        {
          value: "category1",
          label: "Category 1",
          children: [
            { value: "sub1", label: "Sub Category 1" },
            { value: "sub2", label: "Sub Category 2" },
          ],
        },
        {
          value: "category2",
          label: "Category 2",
          children: [
            { value: "sub3", label: "Sub Category 3" },
            { value: "sub4", label: "Sub Category 4" },
          ],
        },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "colorpicker",
      content: "Color Picker",
      label: "Color Picker",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        showText: true,
        format: "hex",
        allowClear: true,
      },
      defaultValue: "#1890ff",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "mentions",
      content: "Mentions",
      label: "Mentions",
      placeholder: "Type @ to mention someone...",
      validation: {
        required: false,
      },
      styling: {
        rows: 3,
        allowClear: true,
        autoSize: true,
      },
      options: [
        { value: "user1", label: "User 1" },
        { value: "user2", label: "User 2" },
        { value: "user3", label: "User 3" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "timepicker",
      content: "Time Picker",
      label: "Time Picker",
      placeholder: "Select time...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        format: "HH:mm:ss",
        use12Hours: false,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "transfer",
      content: "Transfer",
      label: "Transfer",
      validation: {
        required: false,
      },
      styling: {
        showSearch: true,
        showSelectAll: true,
        oneWay: false,
      },
      dataSource: [
        { key: "1", title: "Item 1", description: "Description 1" },
        { key: "2", title: "Item 2", description: "Description 2" },
        { key: "3", title: "Item 3", description: "Description 3" },
        { key: "4", title: "Item 4", description: "Description 4" },
      ],
      targetKeys: [],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "treeselect",
      content: "Tree Select",
      label: "Tree Select",
      placeholder: "Please select...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        showSearch: true,
        multiple: false,
        treeCheckable: false,
      },
      treeData: [
        {
          title: "Node 1",
          value: "node1",
          children: [
            { title: "Child 1", value: "child1" },
            { title: "Child 2", value: "child2" },
          ],
        },
        {
          title: "Node 2",
          value: "node2",
          children: [
            { title: "Child 3", value: "child3" },
            { title: "Child 4", value: "child4" },
          ],
        },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "rate",
      content: "Rate",
      label: "Rating",
      validation: {
        required: false,
      },
      styling: {
        count: 5,
        allowHalf: true,
        allowClear: true,
        character: "★",
      },
      tooltips: ["Terrible", "Bad", "Normal", "Good", "Wonderful"],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "slider",
      content: "Slider",
      label: "Slider",
      validation: {
        required: false,
        min: 0,
        max: 100,
      },
      styling: {
        step: 1,
        marks: {
          0: "0",
          25: "25",
          50: "50",
          75: "75",
          100: "100",
        },
        included: true,
        range: false,
      },
      defaultValue: 30,
    },
  },
  // Data Display Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "avatar",
      content: "Avatar",
      label: "Avatar",
      validation: {
        required: false,
      },
      styling: {
        size: "default",
        shape: "circle",
        icon: "UserOutlined",
      },
      src: "",
      alt: "Avatar",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "badge",
      content: "Badge",
      label: "Badge",
      validation: {
        required: false,
      },
      styling: {
        count: 5,
        showZero: false,
        overflowCount: 99,
        dot: false,
        status: "default",
      },
      text: "Badge Text",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "calendar",
      content: "Calendar",
      label: "Calendar",
      validation: {
        required: false,
      },
      styling: {
        fullscreen: true,
        mode: "month",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "carousel",
      content: "Carousel",
      label: "Carousel",
      validation: {
        required: false,
      },
      styling: {
        autoplay: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      items: [
        { id: 1, content: "Slide 1", background: "#364d79" },
        { id: 2, content: "Slide 2", background: "#1890ff" },
        { id: 3, content: "Slide 3", background: "#722ed1" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "descriptions",
      content: "Descriptions",
      label: "Descriptions",
      validation: {
        required: false,
      },
      styling: {
        bordered: false,
        column: 3,
        size: "default",
        layout: "horizontal",
      },
      title: "User Info",
      items: [
        { key: "name", label: "Name", children: "John Doe" },
        { key: "email", label: "Email", children: "john@example.com" },
        { key: "phone", label: "Phone", children: "+1 234 567 8900" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "empty",
      content: "Empty",
      label: "Empty State",
      validation: {
        required: false,
      },
      styling: {
        image: "default",
        imageStyle: {},
      },
      description: "No data available",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "image",
      content: "Image",
      label: "Image",
      validation: {
        required: false,
      },
      styling: {
        width: 200,
        height: 200,
        preview: true,
        fallback:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN",
      },
      src: "https://via.placeholder.com/200x200",
      alt: "Sample Image",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "list",
      content: "List",
      label: "List",
      validation: {
        required: false,
      },
      styling: {
        bordered: false,
        split: true,
        size: "default",
        itemLayout: "horizontal",
      },
      header: "List Header",
      footer: "List Footer",
      dataSource: [
        { id: 1, title: "Item 1", description: "Description 1" },
        { id: 2, title: "Item 2", description: "Description 2" },
        { id: 3, title: "Item 3", description: "Description 3" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "tag",
      content: "Tag",
      label: "Tag",
      validation: {
        required: false,
      },
      styling: {
        color: "default",
        closable: false,
        bordered: true,
      },
      text: "Sample Tag",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "timeline",
      content: "Timeline",
      label: "Timeline",
      validation: {
        required: false,
      },
      styling: {
        mode: "left",
        pending: false,
        reverse: false,
      },
      items: [
        { color: "green", children: "Create a services site 2015-09-01" },
        {
          color: "green",
          children: "Solve initial network problems 2015-09-01",
        },
        { color: "red", children: "Technical testing 2015-09-01" },
        { color: "blue", children: "Network problems being solved 2015-09-01" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "tree",
      content: "Tree",
      label: "Tree",
      validation: {
        required: false,
      },
      styling: {
        showLine: false,
        showIcon: false,
        checkable: false,
        selectable: true,
        multiple: false,
      },
      treeData: [
        {
          title: "Parent 1",
          key: "0-0",
          children: [
            { title: "Child 1", key: "0-0-0" },
            { title: "Child 2", key: "0-0-1" },
          ],
        },
        {
          title: "Parent 2",
          key: "0-1",
          children: [
            { title: "Child 3", key: "0-1-0" },
            { title: "Child 4", key: "0-1-1" },
          ],
        },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "table",
      content: "Table",
      label: "Table",
      validation: {
        required: false,
      },
      styling: {
        bordered: false,
        size: "default",
        pagination: true,
        scroll: {},
      },
      columns: [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Age", dataIndex: "age", key: "age" },
        { title: "Address", dataIndex: "address", key: "address" },
      ],
      dataSource: [
        {
          key: "1",
          name: "John Brown",
          age: 32,
          address: "New York No. 1 Lake Park",
        },
        {
          key: "2",
          name: "Jim Green",
          age: 42,
          address: "London No. 1 Lake Park",
        },
        {
          key: "3",
          name: "Joe Black",
          age: 32,
          address: "Sidney No. 1 Lake Park",
        },
      ],
    },
  },
  // View Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "gallery_view",
      content: "Gallery View",
      label: "Gallery View",
      validation: {
        required: false,
      },
      styling: {
        columns: 3,
        cardSize: "default",
        showToolbar: true,
      },
      config: {
        cardTemplate: {
          type: "basic",
          showImage: true,
          showTitle: true,
          showDescription: true,
        },
        layout: {
          type: "grid",
          columns: 3,
          gap: 16,
        },
        filters: [],
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "list_view",
      content: "List View",
      label: "List View",
      validation: {
        required: false,
      },
      styling: {
        bordered: false,
        size: "default",
        pagination: true,
        showToolbar: true,
      },
      config: {
        columns: [
          { title: "Name", dataIndex: "name", key: "name", sortable: true },
          { title: "Status", dataIndex: "status", key: "status", filterable: true },
          { title: "Date", dataIndex: "date", key: "date", sortable: true },
        ],
        filters: [],
        actions: {
          canView: true,
          canEdit: true,
          canDelete: false,
        },
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "sheet_view",
      content: "Sheet View",
      label: "Sheet View",
      validation: {
        required: false,
      },
      styling: {
        bordered: true,
        size: "small",
        showToolbar: true,
        allowResize: true,
      },
      config: {
        columns: [
          { title: "A", dataIndex: "col_a", key: "col_a", type: "text", width: 100 },
          { title: "B", dataIndex: "col_b", key: "col_b", type: "number", width: 100 },
          { title: "C", dataIndex: "col_c", key: "col_c", type: "text", width: 100 },
        ],
        settings: {
          allowAddRows: true,
          allowDeleteRows: true,
          allowEditCells: true,
          showGridLines: true,
        },
      },
    },
  },
  // Feedback Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "alert",
      content: "Alert",
      label: "Alert",
      validation: {
        required: false,
      },
      styling: {
        type: "info",
        showIcon: true,
        closable: false,
        banner: false,
      },
      message: "Info Alert",
      description: "This is an informational alert message.",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "progress",
      content: "Progress",
      label: "Progress",
      validation: {
        required: false,
      },
      styling: {
        type: "line",
        status: "active",
        showInfo: true,
        strokeColor: "#1890ff",
        strokeWidth: 6,
      },
      percent: 30,
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "skeleton",
      content: "Skeleton",
      label: "Skeleton",
      validation: {
        required: false,
      },
      styling: {
        active: true,
        avatar: true,
        paragraph: { rows: 4 },
        title: true,
      },
      loading: true,
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "spin",
      content: "Spin",
      label: "Loading Spinner",
      validation: {
        required: false,
      },
      styling: {
        size: "default",
        spinning: true,
      },
      tip: "Loading...",
    },
  },
  // Navigation Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "breadcrumb",
      content: "Breadcrumb",
      label: "Breadcrumb",
      validation: {
        required: false,
      },
      styling: {
        separator: "/",
      },
      items: [
        { title: "Home", href: "/" },
        { title: "Application Center", href: "/apps" },
        { title: "Application List", href: "/apps/list" },
        { title: "An Application" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "menu",
      content: "Menu",
      label: "Menu",
      validation: {
        required: false,
      },
      styling: {
        mode: "vertical",
        theme: "light",
        inlineCollapsed: false,
      },
      items: [
        { key: "1", label: "Navigation One", icon: "MailOutlined" },
        { key: "2", label: "Navigation Two", icon: "CalendarOutlined" },
        {
          key: "sub1",
          label: "Navigation Three - Submenu",
          icon: "AppstoreOutlined",
          children: [
            { key: "3", label: "Option 3" },
            { key: "4", label: "Option 4" },
          ],
        },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "pagination",
      content: "Pagination",
      label: "Pagination",
      validation: {
        required: false,
      },
      styling: {
        size: "default",
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: true,
      },
      current: 1,
      total: 500,
      pageSize: 10,
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "steps",
      content: "Steps",
      label: "Steps",
      validation: {
        required: false,
      },
      styling: {
        type: "default",
        size: "default",
        direction: "horizontal",
        labelPlacement: "horizontal",
      },
      current: 1,
      items: [
        { title: "Finished", description: "This is a description." },
        { title: "In Progress", description: "This is a description." },
        { title: "Waiting", description: "This is a description." },
      ],
    },
  },
  // Layout Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "divider",
      content: "Divider",
      label: "Divider",
      validation: {
        required: false,
      },
      styling: {
        type: "horizontal",
        orientation: "center",
        orientationMargin: 0,
        dashed: false,
        plain: false,
      },
      children: "Divider Text",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "space",
      content: "Space",
      label: "Space",
      validation: {
        required: false,
      },
      styling: {
        direction: "horizontal",
        size: "small",
        align: "center",
        wrap: false,
      },
      children: [
        { type: "button", content: "Button 1" },
        { type: "button", content: "Button 2" },
        { type: "button", content: "Button 3" },
      ],
    },
  },
  // General Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "button",
      content: "Button",
      label: "Button",
      validation: {
        required: false,
      },
      styling: {
        type: "default",
        size: "middle",
        shape: "default",
        block: false,
        danger: false,
        ghost: false,
        loading: false,
        icon: "",
      },
      text: "Click me",
      htmlType: "button",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "typography",
      content: "Typography",
      label: "Typography",
      validation: {
        required: false,
      },
      styling: {
        level: 1,
        type: "secondary",
        disabled: false,
        mark: false,
        code: false,
        keyboard: false,
        underline: false,
        delete: false,
        strong: false,
        italic: false,
      },
      text: "Sample Typography Text",
      component: "title", // title, text, paragraph
    },
  },
  // File & Media Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "upload",
      content: "File Upload",
      label: "File Upload",
      validation: {
        required: false,
      },
      styling: {
        listType: "text",
        multiple: false,
        showUploadList: true,
        accept: "*",
        maxCount: 1,
      },
      action: "/upload",
      text: "Click to Upload",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "imageupload",
      content: "Image Upload",
      label: "Image Upload",
      validation: {
        required: false,
      },
      styling: {
        listType: "picture-card",
        multiple: false,
        showUploadList: true,
        accept: "image/*",
        maxCount: 1,
      },
      action: "/upload",
      text: "+ Upload Image",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "dragger",
      content: "Drag & Drop Upload",
      label: "Drag & Drop Upload",
      validation: {
        required: false,
      },
      styling: {
        multiple: true,
        showUploadList: true,
        accept: "*",
      },
      action: "/upload",
      text: "Click or drag file to this area to upload",
      hint: "Support for a single or bulk upload.",
    },
  },
  // Advanced Field Types
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "email",
      content: "Email Input",
      label: "Email Address",
      placeholder: "Enter email address...",
      validation: {
        required: false,
        type: "email",
      },
      styling: {
        size: "middle",
        allowClear: true,
        prefix: "MailOutlined",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "phone",
      content: "Phone Number",
      label: "Phone Number",
      placeholder: "Enter phone number...",
      validation: {
        required: false,
        pattern: "^[+]?[0-9\\s\\-\\(\\)]+$",
      },
      styling: {
        size: "middle",
        allowClear: true,
        prefix: "PhoneOutlined",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "url",
      content: "URL Input",
      label: "Website URL",
      placeholder: "https://example.com",
      validation: {
        required: false,
        type: "url",
      },
      styling: {
        size: "middle",
        allowClear: true,
        prefix: "LinkOutlined",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "password",
      content: "Password Input",
      label: "Password",
      placeholder: "Enter password...",
      validation: {
        required: false,
        minLength: 6,
      },
      styling: {
        size: "middle",
        visibilityToggle: true,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "currency",
      content: "Currency Input",
      label: "Amount",
      placeholder: "0.00",
      validation: {
        required: false,
        min: 0,
      },
      styling: {
        size: "middle",
        prefix: "$",
        precision: 2,
        formatter: "currency",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "daterange",
      content: "Date Range Picker",
      label: "Date Range",
      placeholder: ["Start date", "End date"],
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        format: "YYYY-MM-DD",
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "datetime",
      content: "Date Time Picker",
      label: "Date & Time",
      placeholder: "Select date and time...",
      validation: {
        required: false,
      },
      styling: {
        size: "middle",
        allowClear: true,
        format: "YYYY-MM-DD HH:mm:ss",
        showTime: true,
      },
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "multiselect",
      content: "Multi Select",
      label: "Multiple Selection",
      placeholder: "Choose multiple options...",
      validation: {
        required: false,
      },
      styling: {
        mode: "multiple",
        allowClear: true,
        showSearch: true,
        maxTagCount: "responsive",
      },
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
        { value: "option4", label: "Option 4" },
      ],
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "checkboxgroup",
      content: "Checkbox Group",
      label: "Multiple Choices",
      validation: {
        required: false,
      },
      styling: {
        direction: "vertical",
      },
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
        { value: "option4", label: "Option 4" },
      ],
    },
  },
  // Data Lookup Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "lookup",
      content: "Data Lookup",
      label: "Lookup Field",
      placeholder: "Search and select...",
      validation: {
        required: false,
      },
      styling: {
        showSearch: true,
        allowClear: true,
        filterOption: true,
      },
      dataSource: "external",
      apiEndpoint: "/api/lookup",
      displayField: "name",
      valueField: "id",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "reference",
      content: "Reference Field",
      label: "Reference",
      placeholder: "Select reference...",
      validation: {
        required: false,
      },
      styling: {
        showSearch: true,
        allowClear: true,
      },
      referenceTable: "users",
      displayField: "name",
      valueField: "id",
    },
  },
  // Widget Components
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "qrcode",
      content: "QR Code",
      label: "QR Code",
      validation: {
        required: false,
      },
      styling: {
        size: 128,
        level: "M",
        includeMargin: false,
      },
      value: "https://example.com",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "barcode",
      content: "Barcode",
      label: "Barcode",
      validation: {
        required: false,
      },
      styling: {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
      },
      value: "123456789",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "signature",
      content: "Digital Signature",
      label: "Signature",
      validation: {
        required: false,
      },
      styling: {
        width: 400,
        height: 200,
        backgroundColor: "#ffffff",
        penColor: "#000000",
      },
      placeholder: "Sign here...",
    },
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "location",
      content: "Location Picker",
      label: "Location",
      validation: {
        required: false,
      },
      styling: {
        mapType: "roadmap",
        zoom: 10,
        height: 300,
      },
      placeholder: "Click to select location",
      defaultLocation: {
        lat: 40.7128,
        lng: -74.0060,
      },
    },
  },
];

export default {
  SIDEBAR_ITEM,
  ROW,
  COLUMN,
  COMPONENT,
  COMPONENT_CAPABILITIES,
  SIDEBAR_ITEMS,
};
