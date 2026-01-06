/**
 * @fileoverview Form Validation Hook for Zionix Authentication
 * 
 * Custom React hook that provides comprehensive form validation functionality
 * with real-time validation, error handling, and form state management.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import { validateForm, hasFormErrors, debounce } from '../utils/validation';

/**
 * Custom hook for form validation and state management
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Object} options - Additional options for the hook
 * @returns {Object} Form state and validation methods
 */
export const useFormValidation = (initialValues = {}, validationRules = {}, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceDelay = 300,
    onSubmit,
  } = options;

  // Form state
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false); // Start as false until validated

  /**
   * Validates a single field
   * @param {string} fieldName - Name of the field to validate
   * @param {any} value - Value to validate
   * @returns {string|null} Error message or null if valid
   */
  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) {
        return error;
      }
    }
    return null;
  }, [validationRules, values]);

  /**
   * Validates all form fields
   * @returns {Object} Object containing all validation errors
   */
  const validateAllFields = useCallback(() => {
    return validateForm(values, validationRules);
  }, [values, validationRules]);

  /**
   * Debounced validation function
   */
  const debouncedValidation = useCallback(
    debounce((fieldName, value) => {
      const error = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }, debounceDelay),
    [validateField, debounceDelay]
  );

  /**
   * Handles input value changes
   * @param {string} fieldName - Name of the field
   * @param {any} value - New value
   */
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validate on change if enabled
    if (validateOnChange && touched[fieldName]) {
      debouncedValidation(fieldName, value);
    }
  }, [validateOnChange, touched, debouncedValidation]);

  /**
   * Handles field blur events
   * @param {string} fieldName - Name of the field
   */
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      const error = validateField(fieldName, values[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  }, [validateOnBlur, validateField, values]);

  /**
   * Handles form submission
   * @param {Event} event - Form submit event
   */
  const handleSubmit = useCallback(async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    setIsSubmitting(true);

    // Validate all fields
    const allErrors = validateAllFields();
    setErrors(allErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Check if form is valid
    const formIsValid = !hasFormErrors(allErrors);
    setIsValid(formIsValid);

    if (formIsValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // Handle submission errors here if needed
      }
    }

    setIsSubmitting(false);
  }, [validateAllFields, validationRules, onSubmit, values]);

  /**
   * Resets the form to initial state
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsValid(true);
  }, [initialValues]);

  /**
   * Sets a specific field value
   * @param {string} fieldName - Name of the field
   * @param {any} value - New value
   */
  const setFieldValue = useCallback((fieldName, value) => {
    handleChange(fieldName, value);
  }, [handleChange]);

  /**
   * Sets a specific field error
   * @param {string} fieldName - Name of the field
   * @param {string|null} error - Error message
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  /**
   * Sets multiple field errors at once
   * @param {Object} newErrors - Object containing field errors
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  /**
   * Gets the error message for a specific field
   * @param {string} fieldName - Name of the field
   * @returns {string|null} Error message or null
   */
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [errors, touched]);

  /**
   * Checks if a specific field has an error
   * @param {string} fieldName - Name of the field
   * @returns {boolean} True if field has error
   */
  const hasFieldError = useCallback((fieldName) => {
    return touched[fieldName] && !!errors[fieldName];
  }, [errors, touched]);

  /**
   * Gets the value for a specific field
   * @param {string} fieldName - Name of the field
   * @returns {any} Field value
   */
  const getFieldValue = useCallback((fieldName) => {
    return values[fieldName] || '';
  }, [values]);

  // Update isValid when values or errors change
  useEffect(() => {
    // Check if all required fields have values
    const allFieldsFilled = Object.keys(validationRules).every(fieldName => {
      const value = values[fieldName];
      return value && value.toString().trim() !== '';
    });

    // Check if there are no errors (filter out null/undefined errors)
    const actualErrors = Object.keys(errors).filter(key => errors[key] !== null && errors[key] !== undefined);
    const noErrors = actualErrors.length === 0;

    setIsValid(allFieldsFilled && noErrors);
  }, [errors, values, validationRules]);

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    isValid,

    // Form handlers
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,

    // Field utilities
    setFieldValue,
    setFieldError,
    setFieldErrors,
    getFieldError,
    hasFieldError,
    getFieldValue,

    // Validation utilities
    validateField,
    validateAllFields,
  };
};

export default useFormValidation;