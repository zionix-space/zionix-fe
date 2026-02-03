/**
 * @fileoverview Forgot Password Page Component for Zionix Authentication
 *
 * Responsive forgot password page with email field, form validation,
 * and smooth animations for mobile-native feel. Integrates with Zionix design
 * system and provides comprehensive user experience for password recovery.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { BaseForm as Form, BaseInput as Input, BaseButton as Button, BaseTypography as Typography, BaseSpace as Space, BaseAlert as Alert, baseMessage } from '@zionix-space/design-system';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@zionix-space/design-system';
import AuthLayout from '../layouts/AuthLayout';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail } from '../utils/validation';
import { useStyles, formVariants, successVariants, buttonVariants, linkVariants } from './ForgotPasswordPage.style';

const { Text, Link, Title } = Typography;

/**
 * Success State Component
 */
const SuccessState = ({ email, onBackToLogin, token, isMobile }) => {
  const styles = useStyles(token);

  const iconStyle = isMobile ? styles.mobileSuccessIconStyle : styles.desktopSuccessIconStyle;
  const titleStyle = isMobile ? styles.mobileSuccessTitleStyle : styles.desktopSuccessTitleStyle;
  const descriptionStyle = isMobile ? styles.mobileSuccessDescriptionStyle : styles.desktopSuccessDescriptionStyle;
  const emailStyle = isMobile ? styles.mobileSuccessEmailStyle : styles.desktopSuccessEmailStyle;
  const buttonStyle = isMobile ? styles.mobileSuccessButtonStyle : styles.desktopSuccessButtonStyle;

  return (
    <motion.div
      variants={successVariants}
      initial="initial"
      animate="animate"
      style={styles.successContainerStyle}
    >
      <div style={styles.successContentStyle}>
        <i className="ri-checkbox-circle-line" style={iconStyle} />
        <Title level={isMobile ? 4 : 3} style={titleStyle}>
          Check Your Email
        </Title>
        <Text style={descriptionStyle}>
          We&apos;ve sent a password reset link to:
        </Text>
        <Text strong style={emailStyle}>
          {email}
        </Text>
        <Text style={descriptionStyle}>
          Click the link in the email to reset your password. If you don&apos;t
          see the email, check your spam folder.
        </Text>
        <motion.div variants={buttonVariants} whileTap="tap">
          <Button
            type="default"
            icon={<i className="ri-arrow-left-line" />}
            onClick={onBackToLogin}
            style={buttonStyle}
            block
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Forgot Password Page Component
 *
 * Features:
 * - Email input for password reset
 * - Real-time form validation
 * - Success state with confirmation
 * - Responsive design for mobile and desktop
 * - Smooth animations and transitions
 * - Integration with Zionix design system
 *
 * @param {Object} props - Component props
 * @param {Function} props.onForgotPassword - Callback function for password reset submission
 * @param {Function} props.onBackToLogin - Callback for back to login navigation
 * @returns {JSX.Element} Forgot password page component
 */
const ForgotPasswordPage = ({ onForgotPassword, onBackToLogin }) => {
  const { token, isMobile } = useTheme();
  const styles = useStyles(token);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Form validation setup
  const validationRules = {
    email: [(value) => validateEmail(value, true)],
  };

  const {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
    getFieldValue,
  } = useFormValidation({ email: '' }, validationRules, {
    onSubmit: async (formData) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (onForgotPassword) {
          await onForgotPassword(formData);
        }

        setSubmittedEmail(formData.email);
        setIsSuccess(true);
        baseMessage.success('Password reset email sent successfully!');
      } catch (error) {
        baseMessage.error('Failed to send reset email. Please try again.');
        throw error;
      }
    },
  });

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (fieldName) => (e) => {
    const value = e.target.value;
    handleChange(fieldName, value);
  };

  /**
   * Handle input blur events
   */
  const handleInputBlur = (fieldName) => () => {
    handleBlur(fieldName);
  };

  /**
   * Handle back to login click
   */
  const handleBackToLoginClick = (e) => {
    e.preventDefault();
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  /**
   * Get responsive styles based on device type
   */
  const inputStyle = isMobile ? styles.mobileInputStyle : styles.desktopInputStyle;
  const buttonStyle = isMobile ? styles.mobileButtonStyle : styles.desktopButtonStyle;
  const formItemStyle = isMobile ? styles.mobileFormItemStyle : styles.desktopFormItemStyle;
  const linkStyle = isMobile ? styles.mobileLinkStyle : styles.desktopLinkStyle;
  const descriptionStyle = isMobile ? styles.mobileDescriptionStyle : styles.desktopDescriptionStyle;

  // Show success state if email was sent successfully
  if (isSuccess) {
    return (
      <AuthLayout title="Password Reset" subtitle="">
        <SuccessState
          email={submittedEmail}
          onBackToLogin={handleBackToLoginClick}
          token={token}
          isMobile={isMobile}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      footer={
        <motion.div variants={linkVariants}>
          <Space
            orientation="vertical"
            size="small"
            style={{ width: '100%', textAlign: 'center' }}
          >
            <Text style={linkStyle}>
              Remember your password?{' '}
              <Link
                onClick={handleBackToLoginClick}
                style={{ fontWeight: 500 }}
              >
                Back to Login
              </Link>
            </Text>
          </Space>
        </motion.div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="forgot-password-form"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Text style={descriptionStyle}>
            Don&apos;t worry! It happens to the best of us. Enter your email
            address and we&apos;ll send you a link to reset your password.
          </Text>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            size={isMobile ? 'middle' : 'large'}
          >
            {/* Email Field */}
            <Form.Item
              label="Email Address"
              style={formItemStyle}
              validateStatus={hasFieldError('email') ? 'error' : ''}
              help={getFieldError('email')}
            >
              <Input
                prefix={
                  <i className="ri-mail-line" style={{ color: token.colorTextSecondary }} />
                }
                placeholder="Enter your email address"
                value={getFieldValue('email')}
                onChange={handleInputChange('email')}
                onBlur={handleInputBlur('email')}
                style={inputStyle}
                autoComplete="email"
                autoFocus
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item style={{ marginBottom: 0 }}>
              <motion.div variants={buttonVariants} whileTap="tap">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  style={buttonStyle}
                  block
                >
                  {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
