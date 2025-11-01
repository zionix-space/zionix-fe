/**
 * Comprehensive Form Schema Validator for MongoDB Storage and Backend Integration
 * Validates complex form schemas with deep validation rules, component properties, and layout structures
 */

/**
 * Validates the complete form schema structure
 * @param {Object} schema - The form schema to validate
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[] }
 */
export const validateFormSchema = (schema) => {
  const errors = [];
  const warnings = [];

  try {
    // Basic schema structure validation
    if (!schema || typeof schema !== "object") {
      errors.push("Schema must be a valid object");
      return { isValid: false, errors, warnings };
    }

    // Required top-level properties
    if (!schema.layout || !Array.isArray(schema.layout)) {
      errors.push("Schema must contain a valid layout array");
    }

    if (!schema.components || typeof schema.components !== "object") {
      errors.push("Schema must contain a valid components object");
    }

    // Validate metadata if present
    if (schema.metadata) {
      validateMetadata(schema.metadata, errors, warnings);
    }

    // Validate layout structure
    if (schema.layout && Array.isArray(schema.layout)) {
      validateLayout(schema.layout, errors, warnings);
    }

    // Validate components
    if (schema.components && typeof schema.components === "object") {
      validateComponents(schema.components, errors, warnings);
    }

    // Cross-reference validation (ensure layout references valid components)
    if (schema.layout && schema.components) {
      validateLayoutComponentReferences(
        schema.layout,
        schema.components,
        errors,
        warnings
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Schema validation failed: ${error.message}`);
    return { isValid: false, errors, warnings };
  }
};

/**
 * Validates schema metadata
 */
const validateMetadata = (metadata, errors, warnings) => {
  if (typeof metadata !== "object") {
    errors.push("Metadata must be an object");
    return;
  }

  // Recommended metadata fields
  const recommendedFields = [
    "version",
    "title",
    "description",
    "createdAt",
    "updatedAt",
  ];
  const missingFields = recommendedFields.filter((field) => !metadata[field]);

  if (missingFields.length > 0) {
    warnings.push(
      `Missing recommended metadata fields: ${missingFields.join(", ")}`
    );
  }

  // Validate version format
  if (metadata.version && !/^\d+\.\d+\.\d+$/.test(metadata.version)) {
    warnings.push("Version should follow semantic versioning (e.g., 1.0.0)");
  }

  // Validate dates
  if (metadata.createdAt && !isValidDate(metadata.createdAt)) {
    errors.push("createdAt must be a valid ISO date string");
  }

  if (metadata.updatedAt && !isValidDate(metadata.updatedAt)) {
    errors.push("updatedAt must be a valid ISO date string");
  }
};

/**
 * Validates layout structure recursively
 */
const validateLayout = (layout, errors, warnings, path = "layout") => {
  if (!Array.isArray(layout)) {
    errors.push(`${path} must be an array`);
    return;
  }

  layout.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    validateLayoutItem(item, errors, warnings, itemPath);
  });
};

/**
 * Validates individual layout items (rows, columns, components)
 */
const validateLayoutItem = (item, errors, warnings, path) => {
  if (!item || typeof item !== "object") {
    errors.push(`${path} must be a valid object`);
    return;
  }

  // Required fields
  if (!item.type) {
    errors.push(`${path} must have a type property`);
  }

  if (!item.id) {
    errors.push(`${path} must have an id property`);
  }

  // Validate based on type
  switch (item.type) {
    case "row":
      validateRowItem(item, errors, warnings, path);
      break;
    case "column":
      validateColumnItem(item, errors, warnings, path);
      break;
    case "component":
      validateComponentReference(item, errors, warnings, path);
      break;
    case "tabContainer":
      validateTabContainerItem(item, errors, warnings, path);
      break;
    case "cardContainer":
      validateCardContainerItem(item, errors, warnings, path);
      break;
    case "formSection":
      validateFormSectionItem(item, errors, warnings, path);
      break;
    default:
      errors.push(`${path} has invalid type: ${item.type}`);
  }
};

/**
 * Validates row layout items
 */
const validateRowItem = (row, errors, warnings, path) => {
  if (!row.children || !Array.isArray(row.children)) {
    errors.push(`${path} (row) must have a children array`);
    return;
  }

  if (row.children.length === 0) {
    warnings.push(`${path} (row) has no children`);
  }

  // Validate that row children are columns
  row.children.forEach((child, index) => {
    if (child.type !== "column") {
      errors.push(`${path}.children[${index}] must be a column`);
    }
  });

  // Recursively validate children
  validateLayout(row.children, errors, warnings, `${path}.children`);
};

/**
 * Validates column layout items
 */
const validateColumnItem = (column, errors, warnings, path) => {
  if (!column.children || !Array.isArray(column.children)) {
    errors.push(`${path} (column) must have a children array`);
    return;
  }

  if (column.children.length === 0) {
    warnings.push(`${path} (column) has no children`);
  }

  // Validate that column children are components
  column.children.forEach((child, index) => {
    if (child.type !== "component") {
      errors.push(`${path}.children[${index}] must be a component`);
    }
  });

  // Recursively validate children
  validateLayout(column.children, errors, warnings, `${path}.children`);
};

/**
 * Validates component references in layout
 */
const validateComponentReference = (component, errors, warnings, path) => {
  if (!component.id) {
    errors.push(`${path} (component) must have an id property`);
  }

  // Additional component-specific validation can be added here
  if (component.children && component.children.length > 0) {
    warnings.push(`${path} (component) should not have children`);
  }
};

/**
 * Validates tab container layout items
 */
const validateTabContainerItem = (item, errors, warnings, path) => {
  if (!item.tabs || !Array.isArray(item.tabs)) {
    errors.push(`${path} (tabContainer) must have a tabs array`);
    return;
  }

  if (item.tabs.length === 0) {
    warnings.push(`${path} (tabContainer) has no tabs`);
  }

  // Validate each tab
  item.tabs.forEach((tab, index) => {
    const tabPath = `${path}.tabs[${index}]`;

    if (!tab || typeof tab !== "object") {
      errors.push(`${tabPath} must be an object`);
      return;
    }

    // Required tab properties
    if (!tab.id) {
      errors.push(`${tabPath} must have an id property`);
    }

    if (!tab.key) {
      errors.push(`${tabPath} must have a key property`);
    }

    if (!tab.label) {
      errors.push(`${tabPath} must have a label property`);
    }

    // Validate tab children (can be components or other containers)
    if (tab.children) {
      if (!Array.isArray(tab.children)) {
        errors.push(`${tabPath}.children must be an array`);
      } else {
        validateLayout(tab.children, errors, warnings, `${tabPath}.children`);
      }
    }
  });
};

/**
 * Validates card container layout items
 */
const validateCardContainerItem = (item, errors, warnings, path) => {
  // Card containers can have children array for column layouts
  if (item.children) {
    if (!Array.isArray(item.children)) {
      errors.push(`${path} (cardContainer) children must be an array`);
    } else {
      validateLayout(item.children, errors, warnings, `${path}.children`);
    }
  }

  // Validate card properties if present
  if (item.cardProps && typeof item.cardProps !== "object") {
    errors.push(`${path}.cardProps must be an object`);
  }
};

/**
 * Validates form section layout items
 */
const validateFormSectionItem = (item, errors, warnings, path) => {
  // Form sections can have children array for column layouts
  if (item.children) {
    if (!Array.isArray(item.children)) {
      errors.push(`${path} (formSection) children must be an array`);
    } else {
      validateLayout(item.children, errors, warnings, `${path}.children`);
    }
  }

  // Validate section properties if present
  if (item.sectionProps && typeof item.sectionProps !== "object") {
    errors.push(`${path}.sectionProps must be an object`);
  }

  // Validate conditional logic if present
  if (item.conditionalLogic && typeof item.conditionalLogic !== "object") {
    errors.push(`${path}.conditionalLogic must be an object`);
  }
};

/**
 * Validates components object and individual component definitions
 */
const validateComponents = (components, errors, warnings) => {
  const componentIds = Object.keys(components);

  if (componentIds.length === 0) {
    warnings.push("No components defined in schema");
    return;
  }

  componentIds.forEach((id) => {
    validateComponent(components[id], errors, warnings, `components.${id}`);
  });
};

/**
 * Validates individual component definitions
 */
const validateComponent = (component, errors, warnings, path) => {
  if (!component || typeof component !== "object") {
    errors.push(`${path} must be a valid object`);
    return;
  }

  // Required component fields
  const requiredFields = ["id", "type", "label"];
  requiredFields.forEach((field) => {
    if (!component[field]) {
      errors.push(`${path} must have a ${field} property`);
    }
  });

  // Validate component type
  const validTypes = [
    "input",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "number",
    "email",
    "password",
    "tabContainer",
    "cardContainer",
    "formSection",
  ];
  if (component.type && !validTypes.includes(component.type)) {
    warnings.push(`${path} has uncommon component type: ${component.type}`);
  }

  // Validate container-specific properties
  if (component.type === "tabContainer") {
    if (component.tabs && !Array.isArray(component.tabs)) {
      errors.push(`${path} (tabContainer) tabs must be an array`);
    }
  }

  if (component.type === "cardContainer") {
    if (component.cardProps && typeof component.cardProps !== "object") {
      errors.push(`${path} (cardContainer) cardProps must be an object`);
    }
  }

  if (component.type === "formSection") {
    if (component.sectionProps && typeof component.sectionProps !== "object") {
      errors.push(`${path} (formSection) sectionProps must be an object`);
    }
    if (
      component.conditionalLogic &&
      typeof component.conditionalLogic !== "object"
    ) {
      errors.push(`${path} (formSection) conditionalLogic must be an object`);
    }
  }

  // Validate validation rules
  if (component.validation) {
    validateComponentValidation(
      component.validation,
      errors,
      warnings,
      `${path}.validation`
    );
  }

  // Validate styling properties
  if (component.styling) {
    validateComponentStyling(
      component.styling,
      errors,
      warnings,
      `${path}.styling`
    );
  }

  // Validate options for select/radio components
  if (["select", "radio"].includes(component.type)) {
    if (!component.options || !Array.isArray(component.options)) {
      errors.push(`${path} (${component.type}) must have an options array`);
    } else {
      validateComponentOptions(
        component.options,
        errors,
        warnings,
        `${path}.options`
      );
    }
  }
};

/**
 * Validates component validation rules
 */
const validateComponentValidation = (validation, errors, warnings, path) => {
  if (typeof validation !== "object") {
    errors.push(`${path} must be an object`);
    return;
  }

  // Validate pattern if present
  if (validation.pattern) {
    try {
      new RegExp(validation.pattern);
    } catch (e) {
      errors.push(`${path}.pattern is not a valid regular expression`);
    }
  }

  // Validate numeric constraints
  if (validation.min !== undefined && typeof validation.min !== "number") {
    errors.push(`${path}.min must be a number`);
  }

  if (validation.max !== undefined && typeof validation.max !== "number") {
    errors.push(`${path}.max must be a number`);
  }

  if (
    validation.min !== undefined &&
    validation.max !== undefined &&
    validation.min > validation.max
  ) {
    errors.push(`${path}.min cannot be greater than max`);
  }
};

/**
 * Validates component styling properties
 */
const validateComponentStyling = (styling, errors, warnings, path) => {
  if (typeof styling !== "object") {
    errors.push(`${path} must be an object`);
    return;
  }

  // Validate size if present
  if (styling.size && !["small", "middle", "large"].includes(styling.size)) {
    warnings.push(`${path}.size should be 'small', 'middle', or 'large'`);
  }

  // Validate rows for textarea
  if (
    styling.rows !== undefined &&
    (typeof styling.rows !== "number" || styling.rows < 1)
  ) {
    errors.push(`${path}.rows must be a positive number`);
  }
};

/**
 * Validates component options for select/radio components
 */
const validateComponentOptions = (options, errors, warnings, path) => {
  if (!Array.isArray(options)) {
    errors.push(`${path} must be an array`);
    return;
  }

  if (options.length === 0) {
    warnings.push(`${path} is empty`);
    return;
  }

  options.forEach((option, index) => {
    const optionPath = `${path}[${index}]`;

    if (!option || typeof option !== "object") {
      errors.push(`${optionPath} must be an object`);
      return;
    }

    if (!option.value) {
      errors.push(`${optionPath} must have a value property`);
    }

    if (!option.label) {
      errors.push(`${optionPath} must have a label property`);
    }
  });

  // Check for duplicate values
  const values = options.map((opt) => opt.value).filter(Boolean);
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index
  );
  if (duplicates.length > 0) {
    errors.push(
      `${path} contains duplicate values: ${[...new Set(duplicates)].join(
        ", "
      )}`
    );
  }
};

/**
 * Cross-validates layout component references against components object
 */
const validateLayoutComponentReferences = (
  layout,
  components,
  errors,
  warnings
) => {
  const componentIds = Object.keys(components);
  const referencedIds = new Set();

  const collectComponentReferences = (items) => {
    items.forEach((item) => {
      if (item.type === "component") {
        referencedIds.add(item.id);
        if (!componentIds.includes(item.id)) {
          errors.push(`Layout references undefined component: ${item.id}`);
        }
      } else if (
        ["tabContainer", "cardContainer", "formSection"].includes(item.type)
      ) {
        // Container components reference themselves in the components registry
        referencedIds.add(item.id);
        if (!componentIds.includes(item.id)) {
          errors.push(
            `Layout references undefined container component: ${item.id}`
          );
        }

        // Check children in container components
        if (item.children) {
          collectComponentReferences(item.children);
        }

        // Check tab children for tab containers
        if (item.type === "tabContainer" && item.tabs) {
          item.tabs.forEach((tab) => {
            if (tab.children) {
              collectComponentReferences(tab.children);
            }
          });
        }
      } else if (item.children) {
        collectComponentReferences(item.children);
      }
    });
  };

  collectComponentReferences(layout);

  // Check for unused components
  const unusedComponents = componentIds.filter((id) => !referencedIds.has(id));
  if (unusedComponents.length > 0) {
    warnings.push(`Unused components defined: ${unusedComponents.join(", ")}`);
  }
};

/**
 * Utility function to validate date strings
 */
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date instanceof Date && !isNaN(date) && dateString === date.toISOString()
  );
};



/**
 * Sanitizes and normalizes schema for MongoDB storage
 */
export const sanitizeSchemaForStorage = (schema) => {
  const sanitized = JSON.parse(JSON.stringify(schema));

  // Add/update metadata
  if (!sanitized.metadata) {
    sanitized.metadata = {};
  }

  sanitized.metadata.updatedAt = new Date().toISOString();

  if (!sanitized.metadata.createdAt) {
    sanitized.metadata.createdAt = new Date().toISOString();
  }

  if (!sanitized.metadata.version) {
    sanitized.metadata.version = "1.0.0";
  }

  return sanitized;
};
