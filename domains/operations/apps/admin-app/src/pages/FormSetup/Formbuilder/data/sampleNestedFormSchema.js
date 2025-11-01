/**
 * Advanced Nested Form Schema - Demonstrates Unlimited Nesting Capabilities
 * This schema showcases the form builder's ability to handle any level of complex nesting
 * with tabs, cards, sections, accordions, steps, and all form components
 */

import shortid from "shortid";

export const sampleNestedFormSchema = {
  metadata: {
    version: "2.0.0",
    title: "Advanced Enterprise Form with Unlimited Nesting",
    description:
      "Demonstrates complex nested structures with tabs, cards, sections, accordions, and steps",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: "Form Builder System",
    category: "enterprise-advanced",
    tags: ["nested", "complex", "unlimited", "enterprise", "multi-step"],
    formId: "ADV_NESTED_001",
    maxNestingDepth: 10,
    supportedContainers: [
      "tabContainer",
      "cardContainer",
      "formSection",
      "accordionContainer",
      "stepsContainer",
      "gridContainer",
      "flexContainer",
    ],
  },
  layout: [
    {
      type: "row",
      id: "main_row",
      children: [
        {
          type: "column",
          id: "main_col",
          children: [
            {
              type: "tabContainer",
              id: "main_tabs",
              tabs: [
                {
                  id: "personal_tab",
                  key: "personal",
                  label: "Personal Information",
                  children: [
                    {
                      type: "cardContainer",
                      id: "personal_card",
                      children: [
                        {
                          type: "accordionContainer",
                          id: "personal_accordion",
                          panels: [
                            {
                              id: "basic_info_panel",
                              key: "basic_info",
                              header: "Basic Information",
                              children: [
                                { type: "component", id: "first_name" },
                                { type: "component", id: "last_name" },
                                { type: "component", id: "email" },
                              ],
                            },
                            {
                              id: "contact_panel",
                              key: "contact",
                              header: "Contact Details",
                              children: [
                                {
                                  type: "formSection",
                                  id: "contact_section",
                                  children: [
                                    { type: "component", id: "phone" },
                                    { type: "component", id: "address" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "business_tab",
                  key: "business",
                  label: "Business Information",
                  children: [
                    {
                      type: "stepsContainer",
                      id: "business_steps",
                      steps: [
                        {
                          id: "company_step",
                          key: "company",
                          title: "Company Details",
                          description: "Enter your company information",
                          children: [
                            {
                              type: "cardContainer",
                              id: "company_card",
                              children: [
                                { type: "component", id: "company_name" },
                                { type: "component", id: "industry" },
                                {
                                  type: "tabContainer",
                                  id: "nested_company_tabs",
                                  tabs: [
                                    {
                                      id: "company_details_tab",
                                      key: "details",
                                      label: "Details",
                                      children: [
                                        {
                                          type: "component",
                                          id: "company_size",
                                        },
                                        { type: "component", id: "revenue" },
                                      ],
                                    },
                                    {
                                      id: "company_location_tab",
                                      key: "location",
                                      label: "Location",
                                      children: [
                                        {
                                          type: "component",
                                          id: "headquarters",
                                        },
                                        { type: "component", id: "branches" },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "role_step",
                          key: "role",
                          title: "Your Role",
                          description: "Tell us about your position",
                          children: [
                            { type: "component", id: "job_title" },
                            { type: "component", id: "department" },
                            { type: "component", id: "experience" },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "preferences_tab",
                  key: "preferences",
                  label: "Preferences & Settings",
                  children: [
                    {
                      type: "accordionContainer",
                      id: "preferences_accordion",
                      panels: [
                        {
                          id: "communication_panel",
                          key: "communication",
                          header: "Communication Preferences",
                          children: [
                            {
                              type: "formSection",
                              id: "comm_section",
                              children: [
                                {
                                  type: "component",
                                  id: "email_notifications",
                                },
                                { type: "component", id: "sms_notifications" },
                                {
                                  type: "cardContainer",
                                  id: "frequency_card",
                                  children: [
                                    {
                                      type: "component",
                                      id: "notification_frequency",
                                    },
                                    { type: "component", id: "preferred_time" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "privacy_panel",
                          key: "privacy",
                          header: "Privacy Settings",
                          children: [
                            { type: "component", id: "data_sharing" },
                            { type: "component", id: "marketing_consent" },
                            {
                              type: "stepsContainer",
                              id: "privacy_steps",
                              steps: [
                                {
                                  id: "consent_step",
                                  key: "consent",
                                  title: "Consent",
                                  description: "Review and provide consent",
                                  children: [
                                    {
                                      type: "component",
                                      id: "terms_agreement",
                                    },
                                    { type: "component", id: "privacy_policy" },
                                  ],
                                },
                                {
                                  id: "verification_step",
                                  key: "verification",
                                  title: "Verification",
                                  description: "Verify your choices",
                                  children: [
                                    {
                                      type: "component",
                                      id: "verification_code",
                                    },
                                    {
                                      type: "component",
                                      id: "confirm_settings",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  components: {
    // Container Components - Required for FormRenderer
    main_tabs: {
      id: "main_tabs",
      type: "tabContainer",
      styling: {
        type: "line",
        size: "large",
        tabPosition: "top",
      },
    },
    personal_card: {
      id: "personal_card",
      type: "cardContainer",
      cardProps: {
        title: "Personal Information",
        bordered: true,
      },
      styling: {
        size: "default",
        bordered: true,
        hoverable: false,
      },
    },
    personal_accordion: {
      id: "personal_accordion",
      type: "accordionContainer",
      accordionProps: {
        defaultActiveKey: ["basic_info"],
        bordered: true,
        ghost: false,
      },
    },
    contact_section: {
      id: "contact_section",
      type: "formSection",
      sectionProps: {
        title: "Contact Information",
        description: "Your contact details",
      },
      styling: {
        bordered: true,
        collapsible: false,
      },
    },
    business_steps: {
      id: "business_steps",
      type: "stepsContainer",
      stepsProps: {
        current: 0,
        status: "process",
        direction: "horizontal",
      },
      styling: {
        type: "default",
        size: "default",
      },
    },
    company_card: {
      id: "company_card",
      type: "cardContainer",
      cardProps: {
        title: "Company Details",
        bordered: true,
      },
      styling: {
        size: "default",
        bordered: true,
      },
    },
    nested_company_tabs: {
      id: "nested_company_tabs",
      type: "tabContainer",
      styling: {
        type: "line",
        size: "default",
        tabPosition: "top",
      },
    },
    preferences_accordion: {
      id: "preferences_accordion",
      type: "accordionContainer",
      accordionProps: {
        defaultActiveKey: ["communication"],
        bordered: true,
        ghost: false,
      },
    },
    comm_section: {
      id: "comm_section",
      type: "formSection",
      sectionProps: {
        title: "Communication Settings",
        description: "How you want to be contacted",
      },
      styling: {
        bordered: true,
        collapsible: false,
      },
    },
    frequency_card: {
      id: "frequency_card",
      type: "cardContainer",
      cardProps: {
        title: "Notification Settings",
        bordered: true,
      },
      styling: {
        size: "small",
        bordered: true,
      },
    },
    privacy_steps: {
      id: "privacy_steps",
      type: "stepsContainer",
      stepsProps: {
        current: 0,
        status: "process",
        direction: "horizontal",
      },
      styling: {
        type: "default",
        size: "small",
      },
    },

    // Basic Information Components
    first_name: {
      id: "first_name",
      name: "firstName",
      type: "input",
      label: "First Name",
      placeholder: "Enter your first name...",
      validation: {
        required: true,
        message: "First name is required",
        min: 2,
        max: 50,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    last_name: {
      id: "last_name",
      name: "lastName",
      type: "input",
      label: "Last Name",
      placeholder: "Enter your last name...",
      validation: {
        required: true,
        message: "Last name is required",
        min: 2,
        max: 50,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    email: {
      id: "email",
      name: "email",
      type: "input",
      label: "Email Address",
      placeholder: "Enter your email...",
      validation: {
        required: true,
        type: "email",
        message: "Please enter a valid email address",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    phone: {
      id: "phone",
      name: "phone",
      type: "input",
      label: "Phone Number",
      placeholder: "Enter your phone number...",
      validation: {
        required: true,
        message: "Phone number is required",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    address: {
      id: "address",
      name: "address",
      type: "textarea",
      label: "Address",
      placeholder: "Enter your address...",
      validation: {
        required: true,
        message: "Address is required",
      },
      styling: {
        rows: 3,
        allowClear: true,
      },
    },
    // Business Information Components
    company_name: {
      id: "company_name",
      name: "companyName",
      type: "input",
      label: "Company Name",
      placeholder: "Enter company name...",
      validation: {
        required: true,
        message: "Company name is required",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    industry: {
      id: "industry",
      name: "industry",
      type: "select",
      label: "Industry",
      placeholder: "Select industry...",
      validation: {
        required: true,
        message: "Please select an industry",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
      options: [
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "education", label: "Education" },
        { value: "manufacturing", label: "Manufacturing" },
      ],
    },
    company_size: {
      id: "company_size",
      name: "companySize",
      type: "radio",
      label: "Company Size",
      validation: {
        required: true,
        message: "Please select company size",
      },
      styling: {
        direction: "vertical",
      },
      options: [
        { value: "1-10", label: "1-10 employees" },
        { value: "11-50", label: "11-50 employees" },
        { value: "51-200", label: "51-200 employees" },
        { value: "200+", label: "200+ employees" },
      ],
    },
    revenue: {
      id: "revenue",
      name: "revenue",
      type: "select",
      label: "Annual Revenue",
      placeholder: "Select revenue range...",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
      options: [
        { value: "under-1m", label: "Under $1M" },
        { value: "1m-10m", label: "$1M - $10M" },
        { value: "10m-50m", label: "$10M - $50M" },
        { value: "over-50m", label: "Over $50M" },
      ],
    },
    headquarters: {
      id: "headquarters",
      name: "headquarters",
      type: "input",
      label: "Headquarters Location",
      placeholder: "Enter headquarters location...",
      validation: {
        required: true,
        message: "Headquarters location is required",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    branches: {
      id: "branches",
      name: "branches",
      type: "number",
      label: "Number of Branches",
      placeholder: "Enter number of branches...",
      validation: {
        required: false,
        min: 0,
        max: 1000,
      },
      styling: {
        size: "large",
      },
    },
    job_title: {
      id: "job_title",
      name: "jobTitle",
      type: "input",
      label: "Job Title",
      placeholder: "Enter your job title...",
      validation: {
        required: true,
        message: "Job title is required",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    department: {
      id: "department",
      name: "department",
      type: "select",
      label: "Department",
      placeholder: "Select department...",
      validation: {
        required: true,
        message: "Please select a department",
      },
      styling: {
        size: "large",
        allowClear: true,
      },
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" },
        { value: "operations", label: "Operations" },
      ],
    },
    experience: {
      id: "experience",
      name: "experience",
      type: "radio",
      label: "Years of Experience",
      validation: {
        required: true,
        message: "Please select your experience level",
      },
      styling: {
        direction: "horizontal",
      },
      options: [
        { value: "0-2", label: "0-2 years" },
        { value: "3-5", label: "3-5 years" },
        { value: "6-10", label: "6-10 years" },
        { value: "10+", label: "10+ years" },
      ],
    },
    email_notifications: {
      id: "email_notifications",
      name: "emailNotifications",
      type: "checkbox",
      label: "Email Notifications",
      text: "Receive notifications via email",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
      },
    },
    sms_notifications: {
      id: "sms_notifications",
      name: "smsNotifications",
      type: "checkbox",
      label: "SMS Notifications",
      text: "Receive notifications via SMS",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
      },
    },
    notification_frequency: {
      id: "notification_frequency",
      name: "notificationFrequency",
      type: "select",
      label: "Notification Frequency",
      placeholder: "Select frequency...",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
      options: [
        { value: "immediate", label: "Immediate" },
        { value: "daily", label: "Daily Digest" },
        { value: "weekly", label: "Weekly Summary" },
        { value: "monthly", label: "Monthly Report" },
      ],
    },
    preferred_time: {
      id: "preferred_time",
      name: "preferredTime",
      type: "select",
      label: "Preferred Time",
      placeholder: "Select preferred time...",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
      options: [
        { value: "morning", label: "Morning (8AM - 12PM)" },
        { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
        { value: "evening", label: "Evening (6PM - 10PM)" },
      ],
    },
    data_sharing: {
      id: "data_sharing",
      name: "dataSharing",
      type: "radio",
      label: "Data Sharing Preferences",
      validation: {
        required: true,
        message: "Please select your data sharing preference",
      },
      styling: {
        direction: "vertical",
      },
      options: [
        { value: "minimal", label: "Minimal - Only essential data" },
        { value: "standard", label: "Standard - Improve services" },
        { value: "full", label: "Full - Personalized experience" },
      ],
    },
    marketing_consent: {
      id: "marketing_consent",
      name: "marketingConsent",
      type: "checkbox",
      label: "Marketing Communications",
      text: "I consent to receive marketing communications",
      validation: {
        required: false,
      },
      styling: {
        size: "large",
      },
    },
    terms_agreement: {
      id: "terms_agreement",
      name: "termsAgreement",
      type: "checkbox",
      label: "Terms and Conditions",
      text: "I agree to the Terms and Conditions",
      validation: {
        required: true,
        message: "You must agree to the terms and conditions",
      },
      styling: {
        size: "large",
      },
    },
    privacy_policy: {
      id: "privacy_policy",
      name: "privacyPolicy",
      type: "checkbox",
      label: "Privacy Policy",
      text: "I have read and accept the Privacy Policy",
      validation: {
        required: true,
        message: "You must accept the privacy policy",
      },
      styling: {
        size: "large",
      },
    },
    verification_code: {
      id: "verification_code",
      name: "verificationCode",
      type: "input",
      label: "Verification Code",
      placeholder: "Enter verification code...",
      validation: {
        required: true,
        message: "Verification code is required",
        len: 6,
      },
      styling: {
        size: "large",
        allowClear: true,
      },
    },
    confirm_settings: {
      id: "confirm_settings",
      name: "confirmSettings",
      type: "checkbox",
      label: "Confirm Settings",
      text: "I confirm all my settings and preferences are correct",
      validation: {
        required: true,
        message: "Please confirm your settings",
      },
      styling: {
        size: "large",
      },
    },
  },
};

export default sampleNestedFormSchema;
