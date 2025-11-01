/**
 * Complex Form Schema Example for MongoDB Storage
 * Demonstrates comprehensive form structure with validation, styling, and metadata
 * This example shows how complex enterprise forms can be stored and retrieved from backend
 */

export const sampleComplexFormSchema = {
  metadata: {
    version: "2.1.0",
    title: "Enterprise Customer Registration Form",
    description: "Comprehensive customer onboarding form with validation and conditional logic",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-20T14:45:00.000Z",
    author: "Form Builder System",
    category: "customer-onboarding",
    tags: ["registration", "enterprise", "validation", "multi-step"],
    formId: "CUST_REG_001",
    organizationId: "org_12345",
    isActive: true,
    approvalStatus: "approved",
    lastModifiedBy: "admin@company.com"
  },
  layout: [
    {
      type: "row",
      id: "personal_info_row",
      children: [
        {
          type: "column",
          id: "personal_col_1",
          children: [
            { type: "component", id: "title_field" },
            { type: "component", id: "first_name" },
            { type: "component", id: "last_name" }
          ]
        },
        {
          type: "column", 
          id: "personal_col_2",
          children: [
            { type: "component", id: "email_address" },
            { type: "component", id: "phone_number" },
            { type: "component", id: "date_of_birth" }
          ]
        }
      ]
    },
    {
      type: "row",
      id: "address_row",
      children: [
        {
          type: "column",
          id: "address_col_1",
          children: [
            { type: "component", id: "street_address" },
            { type: "component", id: "city" }
          ]
        },
        {
          type: "column",
          id: "address_col_2", 
          children: [
            { type: "component", id: "state_province" },
            { type: "component", id: "postal_code" }
          ]
        },
        {
          type: "column",
          id: "address_col_3",
          children: [
            { type: "component", id: "country" }
          ]
        }
      ]
    },
    {
      type: "row",
      id: "business_info_row",
      children: [
        {
          type: "column",
          id: "business_col_1",
          children: [
            { type: "component", id: "company_name" },
            { type: "component", id: "job_title" },
            { type: "component", id: "industry" }
          ]
        },
        {
          type: "column",
          id: "business_col_2",
          children: [
            { type: "component", id: "company_size" },
            { type: "component", id: "annual_revenue" },
            { type: "component", id: "business_type" }
          ]
        }
      ]
    },
    {
      type: "row",
      id: "preferences_row",
      children: [
        {
          type: "column",
          id: "preferences_col",
          children: [
            { type: "component", id: "communication_preferences" },
            { type: "component", id: "newsletter_subscription" },
            { type: "component", id: "terms_agreement" },
            { type: "component", id: "privacy_consent" },
            { type: "component", id: "additional_comments" }
          ]
        }
      ]
    }
  ],
  components: {
    title_field: {
      id: "title_field",
      name: "title",
      type: "select",
      label: "Title",
      placeholder: "Select title...",
      validation: {
        required: true,
        message: "Please select your title"
      },
      styling: {
        size: "large",
        allowClear: true
      },
      options: [
        { value: "mr", label: "Mr." },
        { value: "mrs", label: "Mrs." },
        { value: "ms", label: "Ms." },
        { value: "dr", label: "Dr." },
        { value: "prof", label: "Prof." }
      ]
    },
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
        pattern: "^[A-Za-z\\s\\-']+$",
        patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed"
      },
      styling: {
        size: "large",
        allowClear: true,
        showCount: true
      }
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
        pattern: "^[A-Za-z\\s\\-']+$",
        patternMessage: "Only letters, spaces, hyphens, and apostrophes allowed"
      },
      styling: {
        size: "large",
        allowClear: true,
        showCount: true
      }
    },
    email_address: {
      id: "email_address",
      name: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email address...",
      validation: {
        required: true,
        message: "Valid email address is required",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        patternMessage: "Please enter a valid email address"
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    phone_number: {
      id: "phone_number",
      name: "phone",
      type: "input",
      label: "Phone Number",
      placeholder: "Enter your phone number...",
      validation: {
        required: true,
        message: "Phone number is required",
        pattern: "^[\\+]?[1-9][\\d\\s\\-\\(\\)]{7,15}$",
        patternMessage: "Please enter a valid phone number"
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    date_of_birth: {
      id: "date_of_birth",
      name: "dateOfBirth",
      type: "date",
      label: "Date of Birth",
      placeholder: "Select your date of birth...",
      validation: {
        required: false,
        message: "Please select your date of birth"
      },
      styling: {
        size: "large",
        format: "YYYY-MM-DD"
      }
    },
    street_address: {
      id: "street_address",
      name: "streetAddress",
      type: "textarea",
      label: "Street Address",
      placeholder: "Enter your street address...",
      validation: {
        required: true,
        message: "Street address is required",
        max: 200
      },
      styling: {
        rows: 3,
        allowClear: true,
        showCount: true,
        autoSize: { minRows: 2, maxRows: 4 }
      }
    },
    city: {
      id: "city",
      name: "city",
      type: "input",
      label: "City",
      placeholder: "Enter your city...",
      validation: {
        required: true,
        message: "City is required",
        min: 2,
        max: 100
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    state_province: {
      id: "state_province",
      name: "stateProvince",
      type: "input",
      label: "State/Province",
      placeholder: "Enter your state or province...",
      validation: {
        required: true,
        message: "State/Province is required",
        max: 100
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    postal_code: {
      id: "postal_code",
      name: "postalCode",
      type: "input",
      label: "Postal Code",
      placeholder: "Enter your postal code...",
      validation: {
        required: true,
        message: "Postal code is required",
        pattern: "^[A-Za-z0-9\\s\\-]{3,10}$",
        patternMessage: "Please enter a valid postal code"
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    country: {
      id: "country",
      name: "country",
      type: "select",
      label: "Country",
      placeholder: "Select your country...",
      validation: {
        required: true,
        message: "Please select your country"
      },
      styling: {
        size: "large",
        allowClear: true,
        showSearch: true
      },
      options: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "uk", label: "United Kingdom" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "jp", label: "Japan" },
        { value: "in", label: "India" },
        { value: "br", label: "Brazil" },
        { value: "mx", label: "Mexico" }
      ]
    },
    company_name: {
      id: "company_name",
      name: "companyName",
      type: "input",
      label: "Company Name",
      placeholder: "Enter your company name...",
      validation: {
        required: true,
        message: "Company name is required",
        min: 2,
        max: 150
      },
      styling: {
        size: "large",
        allowClear: true,
        showCount: true
      }
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
        max: 100
      },
      styling: {
        size: "large",
        allowClear: true
      }
    },
    industry: {
      id: "industry",
      name: "industry",
      type: "select",
      label: "Industry",
      placeholder: "Select your industry...",
      validation: {
        required: true,
        message: "Please select your industry"
      },
      styling: {
        size: "large",
        allowClear: true,
        showSearch: true
      },
      options: [
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "education", label: "Education" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "retail", label: "Retail" },
        { value: "consulting", label: "Consulting" },
        { value: "government", label: "Government" },
        { value: "nonprofit", label: "Non-profit" },
        { value: "other", label: "Other" }
      ]
    },
    company_size: {
      id: "company_size",
      name: "companySize",
      type: "radio",
      label: "Company Size",
      validation: {
        required: true,
        message: "Please select your company size"
      },
      styling: {
        direction: "vertical",
        size: "large"
      },
      options: [
        { value: "1-10", label: "1-10 employees" },
        { value: "11-50", label: "11-50 employees" },
        { value: "51-200", label: "51-200 employees" },
        { value: "201-1000", label: "201-1000 employees" },
        { value: "1000+", label: "1000+ employees" }
      ]
    },
    annual_revenue: {
      id: "annual_revenue",
      name: "annualRevenue",
      type: "select",
      label: "Annual Revenue",
      placeholder: "Select annual revenue range...",
      validation: {
        required: false
      },
      styling: {
        size: "large",
        allowClear: true
      },
      options: [
        { value: "under-1m", label: "Under $1M" },
        { value: "1m-10m", label: "$1M - $10M" },
        { value: "10m-50m", label: "$10M - $50M" },
        { value: "50m-100m", label: "$50M - $100M" },
        { value: "over-100m", label: "Over $100M" }
      ]
    },
    business_type: {
      id: "business_type",
      name: "businessType",
      type: "radio",
      label: "Business Type",
      validation: {
        required: true,
        message: "Please select your business type"
      },
      styling: {
        direction: "horizontal",
        size: "large"
      },
      options: [
        { value: "b2b", label: "B2B" },
        { value: "b2c", label: "B2C" },
        { value: "b2b2c", label: "B2B2C" }
      ]
    },
    communication_preferences: {
      id: "communication_preferences",
      name: "communicationPreferences",
      type: "checkbox",
      label: "Communication Preferences",
      text: "How would you like to receive communications?",
      validation: {
        required: false
      },
      styling: {
        size: "large"
      },
      options: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "sms", label: "SMS" },
        { value: "mail", label: "Physical Mail" }
      ]
    },
    newsletter_subscription: {
      id: "newsletter_subscription",
      name: "newsletterSubscription",
      type: "checkbox",
      label: "Newsletter Subscription",
      text: "Subscribe to our monthly newsletter for industry insights and updates",
      validation: {
        required: false
      },
      styling: {
        size: "large"
      }
    },
    terms_agreement: {
      id: "terms_agreement",
      name: "termsAgreement",
      type: "checkbox",
      label: "Terms and Conditions",
      text: "I agree to the Terms and Conditions and Privacy Policy",
      validation: {
        required: true,
        message: "You must agree to the terms and conditions to proceed"
      },
      styling: {
        size: "large"
      }
    },
    privacy_consent: {
      id: "privacy_consent",
      name: "privacyConsent",
      type: "checkbox",
      label: "Privacy Consent",
      text: "I consent to the processing of my personal data as described in the Privacy Policy",
      validation: {
        required: true,
        message: "Privacy consent is required"
      },
      styling: {
        size: "large"
      }
    },
    additional_comments: {
      id: "additional_comments",
      name: "additionalComments",
      type: "textarea",
      label: "Additional Comments",
      placeholder: "Any additional information you'd like to share...",
      validation: {
        required: false,
        max: 1000
      },
      styling: {
        rows: 4,
        allowClear: true,
        showCount: true,
        autoSize: { minRows: 3, maxRows: 8 }
      }
    }
  }
};

export default sampleComplexFormSchema;
