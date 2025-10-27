/**
 * @fileoverview Form Validation Utilities for Zionix Authentication
 * 
 * Provides comprehensive validation functions for authentication forms
 * including email, password, and general field validation with proper
 * error messages and validation rules.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

/**
 * Email validation regex pattern
 * Supports most common email formats
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Password strength validation regex patterns
 */
const PASSWORD_PATTERNS = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: {
    invalid: 'Please enter a valid email address',
    required: 'Email address is required',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters long',
    weak: 'Password should contain uppercase, lowercase, number and special character',
    mismatch: 'Passwords do not match',
  },
  currentPassword: {
    required: 'Current password is required',
    incorrect: 'Current password is incorrect',
  },
  newPassword: {
    required: 'New password is required',
    sameAsCurrent: 'New password must be different from current password',
  },
  confirmPassword: {
    required: 'Please confirm your password',
    mismatch: 'Passwords do not match',
  },
};

/**
 * Validates if a field is required and not empty
 * @param {string} value - The field value to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value) => {
  if (!value || value.trim() === '') {
    return VALIDATION_MESSAGES.required;
  }
  return null;
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email, required = true) => {
  if (required && (!email || email.trim() === '')) {
    return VALIDATION_MESSAGES.email.required;
  }
  
  if (email && !EMAIL_REGEX.test(email.trim())) {
    return VALIDATION_MESSAGES.email.invalid;
  }
  
  return null;
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @param {boolean} required - Whether the field is required
 * @param {boolean} checkStrength - Whether to check password strength
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, required = true, checkStrength = true) => {
  if (required && (!password || password.trim() === '')) {
    return VALIDATION_MESSAGES.password.required;
  }
  
  if (password && !PASSWORD_PATTERNS.minLength.test(password)) {
    return VALIDATION_MESSAGES.password.minLength;
  }
  
  if (checkStrength && password) {
    const hasUpper = PASSWORD_PATTERNS.hasUpperCase.test(password);
    const hasLower = PASSWORD_PATTERNS.hasLowerCase.test(password);
    const hasNumber = PASSWORD_PATTERNS.hasNumber.test(password);
    const hasSpecial = PASSWORD_PATTERNS.hasSpecialChar.test(password);
    
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return VALIDATION_MESSAGES.password.weak;
    }
  }
  
  return null;
};

/**
 * Validates password confirmation
 * @param {string} password - The original password
 * @param {string} confirmPassword - The confirmation password
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword, required = true) => {
  if (required && (!confirmPassword || confirmPassword.trim() === '')) {
    return VALIDATION_MESSAGES.confirmPassword.required;
  }
  
  if (confirmPassword && password !== confirmPassword) {
    return VALIDATION_MESSAGES.confirmPassword.mismatch;
  }
  
  return null;
};

/**
 * Validates current password (for change password form)
 * @param {string} currentPassword - The current password
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} Error message or null if valid
 */
export const validateCurrentPassword = (currentPassword, required = true) => {
  if (required && (!currentPassword || currentPassword.trim() === '')) {
    return VALIDATION_MESSAGES.currentPassword.required;
  }
  
  return null;
};

/**
 * Validates new password (for change password form)
 * @param {string} newPassword - The new password
 * @param {string} currentPassword - The current password
 * @param {boolean} required - Whether the field is required
 * @returns {string|null} Error message or null if valid
 */
export const validateNewPassword = (newPassword, currentPassword, required = true) => {
  if (required && (!newPassword || newPassword.trim() === '')) {
    return VALIDATION_MESSAGES.newPassword.required;
  }
  
  // Check password strength
  const strengthError = validatePassword(newPassword, false, true);
  if (strengthError) {
    return strengthError;
  }
  
  // Check if new password is different from current
  if (newPassword && currentPassword && newPassword === currentPassword) {
    return VALIDATION_MESSAGES.newPassword.sameAsCurrent;
  }
  
  return null;
};

/**
 * Validates an entire form object
 * @param {Object} formData - The form data object
 * @param {Object} validationRules - The validation rules for each field
 * @returns {Object} Object containing validation errors for each field
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];
    
    for (const rule of rules) {
      const error = rule(value, formData);
      if (error) {
        errors[fieldName] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return errors;
};

/**
 * Checks if form has any validation errors
 * @param {Object} errors - The errors object from validateForm
 * @returns {boolean} True if form has errors, false otherwise
 */
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Gets password strength level
 * @param {string} password - The password to check
 * @returns {Object} Object containing strength level and score
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { level: 'none', score: 0, color: '#d9d9d9' };
  }
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasUpper: PASSWORD_PATTERNS.hasUpperCase.test(password),
    hasLower: PASSWORD_PATTERNS.hasLowerCase.test(password),
    hasNumber: PASSWORD_PATTERNS.hasNumber.test(password),
    hasSpecial: PASSWORD_PATTERNS.hasSpecialChar.test(password),
  };
  
  // Calculate score
  if (checks.length) score += 20;
  if (checks.hasUpper) score += 20;
  if (checks.hasLower) score += 20;
  if (checks.hasNumber) score += 20;
  if (checks.hasSpecial) score += 20;
  
  // Determine strength level
  let level = 'weak';
  let color = '#ff4d4f';
  
  if (score >= 80) {
    level = 'strong';
    color = '#52c41a';
  } else if (score >= 60) {
    level = 'medium';
    color = '#faad14';
  }
  
  return { level, score, color, checks };
};

/**
 * Debounce function for validation
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};