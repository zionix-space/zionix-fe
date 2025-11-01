import { COMPONENT, ROW, COLUMN } from "../constants";

const initialData = {
  sections: [
    {
      id: "section1",
      title: "Section 1",
      description: "Personal Information",
      layout: [
    {
      type: ROW,
      id: "row0",
      children: [
        {
          type: COLUMN,
          id: "column0",
          children: [
            {
              type: COMPONENT,
              id: "component0",
            },
            {
              type: COMPONENT,
              id: "component1",
            },
          ],
        },
        {
          type: COLUMN,
          id: "column1",
          children: [
            {
              type: COMPONENT,
              id: "component2",
            },
          ],
        },
      ],
    },
    {
      type: ROW,
      id: "row1",
      children: [
        {
          type: COLUMN,
          id: "column2",
          children: [
            {
              type: COMPONENT,
              id: "component3",
            },
            {
              type: COMPONENT,
              id: "component0",
            },
            {
              type: COMPONENT,
              id: "component2",
            },
          ],
        },
      ],
    },
      ],
    },
    {
      id: "section2",
      title: "Section 2",
      description: "Contact Information",
      layout: [
        {
          type: ROW,
          id: "row2",
          children: [
            {
              type: COLUMN,
              id: "column3",
              children: [
                {
                  type: COMPONENT,
                  id: "component4",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  components: {
    component0: {
      id: "component0",
      name: "firstName",
      type: "input",
      content: "Text Input",
      label: "First Name",
      placeholder: "Enter your first name...",
      validation: {
        required: true,
        message: "First name is required",
        min: 2,
        max: 50,
        pattern: "^[A-Za-z\\s]+$",
        patternMessage: "Only letters and spaces allowed",
      },
      styling: {
        size: "large",
        allowClear: true,
        showCount: true,
      },
    },
    component1: {
      id: "component1",
      name: "description",
      type: "textarea",
      content: "Text Area",
      label: "Description",
      placeholder: "Enter a description...",
      validation: {
        required: false,
        max: 500,
      },
      styling: {
        rows: 4,
        allowClear: true,
        showCount: true,
        autoSize: { minRows: 3, maxRows: 6 },
      },
    },
    component2: {
      id: "component2",
      name: "country",
      type: "select",
      content: "Select Dropdown",
      label: "Country",
      placeholder: "Select your country...",
      validation: {
        required: true,
        message: "Please select a country",
      },
      styling: {
        allowClear: true,
        showSearch: true,
        size: "large",
      },
      options: [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
      ],
    },
    component3: {
      id: "component3",
      name: "gender",
      type: "radio",
      content: "Radio Group",
      label: "Gender",
      validation: {
        required: true,
        message: "Please select your gender",
      },
      styling: {
        direction: "horizontal",
        size: "large",
      },
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    component4: {
      id: "component4",
      name: "newsletter",
      type: "checkbox",
      content: "Checkbox",
      label: "Newsletter",
      text: "Subscribe to our newsletter",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
      },
    },
  },
};

export default initialData;