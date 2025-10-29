import React, { useState, useCallback, memo, useMemo } from "react";
import { Form, Button, Space, message } from "antd";
import LayoutRenderer from "./LayoutRenderer";

// Memoized FormRenderer for better performance
const FormRenderer = memo(
  ({
    layout,
    sections,
    components,
    layoutType = 'single',
    formTitle,
    formDescription,
    onSubmit,
    onValuesChange,
    initialValues = {},
    formProps = {},
    showSubmitButton = true,
    submitButtonText = "Submit",
    showResetButton = true,
    resetButtonText = "Reset",
    buttonProps = {},
    className,
    style,
  }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleSubmit = useCallback(
      async (values) => {
        if (!onSubmit) {
          message.info("Form submitted successfully!");
          console.log("Form values:", values);
          return;
        }

        try {
          setLoading(true);
          await onSubmit(values);
          message.success("Form submitted successfully!");
        } catch (error) {
          console.error("Form submission error:", error);
          message.error("Failed to submit form. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      [onSubmit]
    );

    // Handle form reset
    const handleReset = useCallback(() => {
      form.resetFields();
      message.info("Form has been reset");
    }, [form]);

    // Handle form validation failure
    const handleFinishFailed = useCallback((errorInfo) => {
      console.log("Form validation failed:", errorInfo);
      message.error("Please check the form and fix any errors");
    }, []);

    // Handle form values change
    const handleValuesChange = useCallback(
      (changedValues, allValues) => {
        if (onValuesChange) {
          onValuesChange(changedValues, allValues);
        }
      },
      [onValuesChange]
    );

    // Memoized form props to prevent unnecessary re-renders
    const defaultFormProps = useMemo(
      () => ({
        form,
        layout: "vertical",
        initialValues,
        onFinish: handleSubmit,
        onFinishFailed: handleFinishFailed,
        onValuesChange: handleValuesChange,
        autoComplete: "off",
        ...formProps,
      }),
      [
        form,
        initialValues,
        handleSubmit,
        handleFinishFailed,
        handleValuesChange,
        formProps,
      ]
    );

    // Memoized form item style
    const formItemStyle = useMemo(
      () => ({
        marginTop: "24px",
        marginBottom: 0,
      }),
      []
    );

    // Memoized button props
    const submitButtonProps = useMemo(
      () => ({
        type: "primary",
        htmlType: "submit",
        loading,
        ...buttonProps.submit,
      }),
      [loading, buttonProps.submit]
    );

    const resetButtonProps = useMemo(
      () => ({
        onClick: handleReset,
        ...buttonProps.reset,
      }),
      [handleReset, buttonProps.reset]
    );

    return (
      <div className={className} style={style}>
        {formTitle && <h2>{formTitle}</h2>}
        {formDescription && <p>{formDescription}</p>}
        <Form {...defaultFormProps}>
          <LayoutRenderer
            layout={layout}
            sections={sections}
            components={components}
            layoutType={layoutType}
            formInstance={form}
            onValuesChange={handleValuesChange}
          />

          {(showSubmitButton || showResetButton) && (
            <Form.Item style={formItemStyle}>
              <Space>
                {showSubmitButton && (
                  <Button {...submitButtonProps}>{submitButtonText}</Button>
                )}
                {showResetButton && (
                  <Button {...resetButtonProps}>{resetButtonText}</Button>
                )}
              </Space>
            </Form.Item>
          )}
        </Form>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to ensure re-render when layout or components change - avoid JSON.stringify
    if (
      prevProps.onSubmit !== nextProps.onSubmit ||
      prevProps.onValuesChange !== nextProps.onValuesChange ||
      prevProps.showSubmitButton !== nextProps.showSubmitButton ||
      prevProps.showResetButton !== nextProps.showResetButton ||
      prevProps.submitButtonText !== nextProps.submitButtonText ||
      prevProps.resetButtonText !== nextProps.resetButtonText ||
      prevProps.className !== nextProps.className ||
      prevProps.style !== nextProps.style
    ) {
      return false;
    }

    // Compare layout array length and structure (shallow comparison)
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

    // Compare initialValues and formProps (shallow comparison of keys)
    const prevInitialKeys = Object.keys(prevProps.initialValues || {});
    const nextInitialKeys = Object.keys(nextProps.initialValues || {});
    const prevFormPropKeys = Object.keys(prevProps.formProps || {});
    const nextFormPropKeys = Object.keys(nextProps.formProps || {});

    if (
      prevInitialKeys.length !== nextInitialKeys.length ||
      prevFormPropKeys.length !== nextFormPropKeys.length
    ) {
      return false;
    }

    return true;
  }
);

// Set display name for debugging
FormRenderer.displayName = "FormRenderer";

export default FormRenderer;
