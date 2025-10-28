/**
 * @fileoverview Change Password Page Component for Zionix Authentication
 * 
 * Responsive change password page with current/new password fields, form validation,
 * password strength indicator, and smooth animations for mobile-native feel. 
 * Integrates with Zionix design system and provides comprehensive user experience.
 * 
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, Progress, Alert, message } from 'antd';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@zionix/design-system';
import AuthLayout from '../layouts/AuthLayout';
import { useFormValidation } from '../hooks/useFormValidation';
import { validatePassword, getPasswordStrength } from '../utils/validation';
import { useStyles, formVariants, successVariants, buttonVariants, linkVariants, strengthVariants } from './ChangePasswordPage.style';

const { Text, Link, Title } = Typography;

/**
 * Password Strength Indicator Component
 */
const PasswordStrengthIndicator = ({ password, token, isMobile }) => {
  const styles = useStyles(token);
  const strength = getPasswordStrength(password);
  
  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength.level) {
      case 'weak': return token.colorError;
      case 'medium': return token.colorWarning;
      case 'strong': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  const getStrengthText = () => {
    switch (strength.level) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  const strengthContainerStyle = isMobile ? styles.mobileStrengthContainerStyle : styles.desktopStrengthContainerStyle;
  const strengthTextStyle = isMobile ? styles.mobileStrengthTextStyle : styles.desktopStrengthTextStyle;
  const strengthProgressStyle = isMobile ? styles.mobileStrengthProgressStyle : styles.desktopStrengthProgressStyle;
  const strengthRequirementsStyle = isMobile ? styles.mobileStrengthRequirementsStyle : styles.desktopStrengthRequirementsStyle;

  return (
    <AnimatePresence>
      <motion.div
        variants={strengthVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={strengthContainerStyle}
      >
        <div style={styles.strengthHeaderStyle}>
          <Text style={strengthTextStyle}>
            Password Strength: <span style={{ color: getStrengthColor() }}>{getStrengthText()}</span>
          </Text>
          <Progress
            percent={strength.score * 25}
            strokeColor={getStrengthColor()}
            showInfo={false}
            style={strengthProgressStyle}
          />
        </div>
        
        <div style={strengthRequirementsStyle}>
          {strength.requirements.map((req, index) => (
            <div key={index} style={styles.strengthRequirementStyle}>
              <span style={{ 
                color: req.met ? token.colorSuccess : token.colorTextSecondary,
                marginRight: token.marginXS 
              }}>
                {req.met ? '✓' : '○'}
              </span>
              <Text style={{ 
                fontSize: isMobile ? token.fontSizeXS : token.fontSizeSM,
                color: req.met ? token.colorSuccess : token.colorTextSecondary 
              }}>
                {req.text}
              </Text>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Success State Component
 */
const SuccessState = ({ onBackToLogin, token, isMobile }) => {
  const styles = useStyles(token);
  
  const iconStyle = isMobile ? styles.mobileSuccessIconStyle : styles.desktopSuccessIconStyle;
  const titleStyle = isMobile ? styles.mobileSuccessTitleStyle : styles.desktopSuccessTitleStyle;
  const descriptionStyle = isMobile ? styles.mobileSuccessDescriptionStyle : styles.desktopSuccessDescriptionStyle;
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
          Password Changed Successfully
        </Title>
        <Text style={descriptionStyle}>
          Your password has been updated successfully. You can now use your new password to sign in.
        </Text>
        <motion.div variants={buttonVariants} whileTap="tap">
          <Button
            type="primary"
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
 * Change Password Page Component
 *
 * Features:
 * - Current password verification
 * - New password input with strength indicator
 * - Password confirmation
 * - Real-time form validation
 * - Success state with confirmation
 * - Responsive design for mobile and desktop
 * - Smooth animations and transitions
 * - Integration with Zionix design system
 *
 * @param {Object} props - Component props
 * @param {Function} props.onChangePassword - Callback function for password change submission
 * @param {Function} props.onBackToLogin - Callback for back to login navigation
 * @returns {JSX.Element} Change password page component
 */
const ChangePasswordPage = ({ 
  onChangePassword, 
  onBackToLogin 
}) => {
  const { token, isMobile } = useTheme();
  const styles = useStyles(token);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation setup
  const validationRules = {
    currentPassword: [
      (value) => {
        if (!value) {
          return { isValid: false, message: 'Please enter your current password' };
        }
        return { isValid: true };
      },
    ],
    newPassword: [(value) => validatePassword(value, true)],
    confirmPassword: [
      (value, formValues) => {
        if (!value) {
          return { isValid: false, message: 'Please confirm your new password' };
        }
        if (value !== formValues.newPassword) {
          return { isValid: false, message: 'Passwords do not match' };
        }
        return { isValid: true };
      },
    ],
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
  } = useFormValidation(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationRules,
    {
      onSubmit: async (formData) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (onChangePassword) {
            await onChangePassword({
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            });
          }
          
          setIsSuccess(true);
          message.success('Password changed successfully!');
        } catch (error) {
          message.error('Failed to change password. Please check your current password.');
          throw error;
        }
      },
    }
  );

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

  // Show success state if password was changed successfully
  if (isSuccess) {
    return (
      <AuthLayout title="Password Changed" subtitle="">
        <SuccessState
          onBackToLogin={handleBackToLoginClick}
          token={token}
          isMobile={isMobile}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Change Password"
      subtitle="Update your password to keep your account secure"
      footer={
        <motion.div variants={linkVariants}>
          <Space
            direction="vertical"
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
          key="change-password-form"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            size={isMobile ? 'middle' : 'large'}
          >
            {/* Current Password Field */}
            <Form.Item
              label="Current Password"
              style={formItemStyle}
              validateStatus={hasFieldError('currentPassword') ? 'error' : ''}
              help={getFieldError('currentPassword')}
            >
              <Input.Password
                prefix={<i className="ri-lock-line" style={{ color: token.colorTextSecondary }} />}
                placeholder="Enter your current password"
                value={getFieldValue('currentPassword')}
                onChange={handleInputChange('currentPassword')}
                onBlur={handleInputBlur('currentPassword')}
                style={inputStyle}
                iconRender={(visible) => (visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />)}
                autoComplete="current-password"
              />
            </Form.Item>

            {/* New Password Field */}
            <Form.Item
              label="New Password"
              style={formItemStyle}
              validateStatus={hasFieldError('newPassword') ? 'error' : ''}
              help={getFieldError('newPassword')}
            >
              <Input.Password
                prefix={<i className="ri-lock-line" style={{ color: token.colorTextSecondary }} />}
                placeholder="Enter your new password"
                value={getFieldValue('newPassword')}
                onChange={handleInputChange('newPassword')}
                onBlur={handleInputBlur('newPassword')}
                style={inputStyle}
                iconRender={(visible) => (visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />)}
                autoComplete="new-password"
              />
              
              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator
                password={getFieldValue('newPassword')}
                token={token}
                isMobile={isMobile}
              />
            </Form.Item>

            {/* Confirm Password Field */}
            <Form.Item
              label="Confirm New Password"
              style={formItemStyle}
              validateStatus={hasFieldError('confirmPassword') ? 'error' : ''}
              help={getFieldError('confirmPassword')}
            >
              <Input.Password
                prefix={<i className="ri-lock-line" style={{ color: token.colorTextSecondary }} />}
                placeholder="Confirm your new password"
                value={getFieldValue('confirmPassword')}
                onChange={handleInputChange('confirmPassword')}
                onBlur={handleInputBlur('confirmPassword')}
                style={inputStyle}
                iconRender={(visible) => (visible ? <i className="ri-eye-line" /> : <i className="ri-eye-off-line" />)}
                autoComplete="new-password"
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
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ChangePasswordPage;