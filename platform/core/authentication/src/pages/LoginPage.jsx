/**
 * @fileoverview Login Page Component for Zionix Authentication
 *
 * Responsive login page with email/password authentication, form validation,
 * and smooth animations for mobile-native feel. Integrates with Zionix design
 * system and provides comprehensive user experience.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
  Divider,
  message,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTheme } from '@zionix/design-system';
import AuthLayout from '../layouts/AuthLayout';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validatePassword } from '../utils/validation';
import { useStyles, formVariants, buttonVariants, linkVariants } from './LoginPage.style';

const { Text, Link } = Typography;

/**
 * Login Page Component
 *
 * Features:
 * - Email and password authentication
 * - Real-time form validation
 * - Remember me functionality
 * - Responsive design for mobile and desktop
 * - Smooth animations and transitions
 * - Integration with Zionix design system
 *
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Callback function for login submission
 * @param {Function} props.onForgotPassword - Callback for forgot password navigation
 * @param {Function} props.onSignUp - Callback for sign up navigation
 * @returns {JSX.Element} Login page component
 */
const LoginPage = ({ onLogin, onForgotPassword, onSignUp }) => {
  const { token, isMobile } = useTheme();
  const styles = useStyles(token);
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation setup
  const validationRules = {
    email: [(value) => validateEmail(value, true)],
    password: [
      (value) => validatePassword(value, true, false), // Don't check strength for login
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
  } = useFormValidation({ email: '', password: '' }, validationRules, {
    onSubmit: async (formData) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (onLogin) {
          await onLogin({ ...formData, rememberMe });
        }

        message.success('Login successful!');
      } catch (error) {
        message.error('Login failed. Please check your credentials.');
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
   * Handle forgot password click
   */
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  /**
   * Handle sign up click
   */
  const handleSignUpClick = (e) => {
    e.preventDefault();
    if (onSignUp) {
      onSignUp();
    }
  };

  /**
   * Get responsive styles based on device type
   */
  const inputStyle = isMobile ? styles.mobileInputStyle : styles.desktopInputStyle;
  const buttonStyle = isMobile ? styles.mobileButtonStyle : styles.desktopButtonStyle;
  const formItemStyle = isMobile ? styles.mobileFormItemStyle : styles.desktopFormItemStyle;
  const checkboxStyle = isMobile ? styles.mobileCheckboxStyle : styles.desktopCheckboxStyle;
  const linkStyle = isMobile ? styles.mobileLinkStyle : styles.desktopLinkStyle;
  const formStyle = isMobile ? styles.mobileFormStyle : styles.desktopFormStyle;
  const rememberMeContainerStyle = isMobile ? styles.mobileRememberMeContainerStyle : styles.desktopRememberMeContainerStyle;
  const dividerStyle = isMobile ? styles.mobileDividerStyle : styles.desktopDividerStyle;
  const dividerTextStyle = isMobile ? styles.mobileDividerTextStyle : styles.desktopDividerTextStyle;

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footer={
        <motion.div variants={linkVariants}>
          <Space
            direction="vertical"
            size="small"
            style={{ width: '100%', textAlign: 'center' }}
          >
            <Text style={linkStyle}>
              Don&apos;t have an account?{' '}
              <Link onClick={handleSignUpClick} style={{ fontWeight: 500 }}>
                Sign up
              </Link>
            </Text>
          </Space>
        </motion.div>
      }
    >
      <motion.div variants={formVariants} style={formStyle}>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size={isMobile ? 'large' : 'large'} // Use large size on mobile for better touch targets
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
                <MailOutlined style={{ color: token.colorTextSecondary }} />
              }
              placeholder="Enter your email address"
              value={getFieldValue('email')}
              onChange={handleInputChange('email')}
              onBlur={handleInputBlur('email')}
              style={inputStyle}
              autoComplete="email"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            style={formItemStyle}
            validateStatus={hasFieldError('password') ? 'error' : ''}
            help={getFieldError('password')}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: token.colorTextSecondary }} />
              }
              placeholder="Enter your password"
              value={getFieldValue('password')}
              onChange={handleInputChange('password')}
              onBlur={handleInputBlur('password')}
              style={inputStyle}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              autoComplete="current-password"
            />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <Form.Item style={formItemStyle}>
            <div style={rememberMeContainerStyle}>
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={checkboxStyle}
              >
                Remember me
              </Checkbox>
              <Link
                onClick={handleForgotPasswordClick}
                style={{ ...linkStyle, fontWeight: 500 }}
              >
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          {/* Login Button */}
          <Form.Item style={styles.submitButtonContainerStyle}>
            <motion.div variants={buttonVariants} whileTap="tap">
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={!isValid || isSubmitting}
                style={buttonStyle}
                block
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
          </Form.Item>

          {/* Divider for future social login */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.4, duration: 0.3 },
              }}
            >
              <Divider style={dividerStyle}>
                <Text style={dividerTextStyle}>
                  More options coming soon
                </Text>
              </Divider>
            </motion.div>
          )}
        </Form>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
