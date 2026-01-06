/**
 * @fileoverview Modern Split-Screen Login Page for Zionix Authentication
 *
 * Professional login page with split-screen layout, social authentication,
 * and promotional content. Matches the target design exactly with dotwork
 * branding and blue gradient promotional side.
 *
 * @author Zionix Authentication Team
 * @version 2.0.0
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  message,
  Row,
  Col,
  Carousel,
} from 'antd';
import { motion } from 'framer-motion';
import { useTheme, ZionixLogo } from '@zionix/design-system';
import {
  useStyles,
  containerVariants,
  formVariants,
  promoVariants,
  carouselCustomCSS,
} from './LoginPage.style';

const { Text, Link, Title } = Typography;

/**
 * Carousel slides data for promotional content
 */
const carouselSlides = [
  {
    id: 1,
    icon: <i className="ri-shield-check-line" />,
    title: 'MFA for all accounts',
    description:
      'Secure online accounts with multi-factor authentication. Back up OTP tokens and never lose access to your accounts.',
    illustration: <i className="ri-user-line" />,
  },
  {
    id: 2,
    icon: <i className="ri-shield-star-line" />,
    title: 'Enterprise-grade Security',
    description:
      'Your data is protected with bank-level encryption. Advanced security protocols keep your information safe.',
    illustration: <i className="ri-shield-star-line" />,
  },
  {
    id: 3,
    icon: <i className="ri-links-line" />,
    title: 'Seamless Integration',
    description:
      'Connect with every application you use. Everything you need in an easily customizable dashboard.',
    illustration: <i className="ri-links-line" />,
  },
];

/**
 * Modern Split-Screen Login Page Component
 *
 * Features:
 * - Split-screen layout with form and promotional content
 * - Social login options (Google and Facebook)
 * - Email and password authentication
 * - Real-time form validation
 * - Beautiful blue gradient promotional side
 * - Floating UI elements and dashboard previews
 * - Responsive design for mobile and desktop
 *
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Callback function for login submission
 * @param {Function} props.onForgotPassword - Callback for forgot password navigation
 * @param {Function} props.onSignUp - Callback for sign up navigation
 * @param {Function} props.onSocialLogin - Callback for social login
 * @returns {JSX.Element} Modern login page component
 */
const LoginPage = ({ onLogin, onForgotPassword, onSignUp, onSocialLogin }) => {
  const { token, isMobile } = useTheme();
  const styles = useStyles(token);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (onLogin) {
        await onLogin({
          email: values.email,
          password: values.password,
          rememberMe: values.remember || false,
        });
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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

  // Mobile layout - single column
  if (isMobile) {
    return (
      <div style={styles.mobileContainer}>
        <motion.div
          style={styles.mobileFormContainer}
          variants={formVariants}
          initial="initial"
          animate="animate"
        >
          {/* Mobile Logo */}
          <div style={styles.mobileLogo}>
            <div style={styles.dotworkLogo}>
              <div style={styles.logoIcon}>
                <ZionixLogo />
              </div>
              <span style={styles.logoText}>Zionix</span>
            </div>
          </div>

          {/* Mobile Form Content */}
          <div style={styles.mobileFormContent}>
            <Title level={2} style={styles.mobileTitle}>
              Log in to your Account
            </Title>
            {/* <Text style={styles.mobileSubtitle}>
              Welcome back! Select method to log in:
            </Text> */}

            {/* Divider */}
            <Divider style={styles.divider}>
              <Text style={styles.dividerText}>Continue with email</Text>
            </Divider>

            {/* Login Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              {/* Email Field */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                style={styles.formItem}
              >
                <Input
                  prefix={
                    <i className="ri-mail-line" style={styles.inputIcon} />
                  }
                  placeholder="Email"
                  style={styles.input}
                  autoComplete="email"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
                style={styles.formItem}
              >
                <Input.Password
                  prefix={
                    <i className="ri-lock-line" style={styles.inputIcon} />
                  }
                  placeholder="Password"
                  style={styles.input}
                  iconRender={(visible) =>
                    visible ? (
                      <i className="ri-eye-line" />
                    ) : (
                      <i className="ri-eye-off-line" />
                    )
                  }
                  autoComplete="current-password"
                />
              </Form.Item>

              {/* Remember Me & Forgot Password */}
              <div style={styles.rememberForgotContainer}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={styles.checkbox}>Remember me</Checkbox>
                </Form.Item>
                <Link
                  onClick={handleForgotPasswordClick}
                  style={styles.forgotLink}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.loginButton}
                block
              >
                Log In
              </Button>
            </Form>

            {/* Sign Up Link */}
            <div style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don't have an account?{' '}
                <Link onClick={handleSignUpClick} style={styles.signUpLink}>
                  Create an account
                </Link>
              </Text>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Desktop layout - split screen
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: carouselCustomCSS }} />
      <div style={styles.container}>
        <Row style={styles.row}>
          {/* Left Side - Login Form */}
          <Col span={12} style={styles.leftColumn}>
            <motion.div
              style={styles.formContainer}
              variants={formVariants}
              initial="initial"
              animate="animate"
            >
              {/* Logo */}
              <div style={styles.logo}>
                <div style={styles.dotworkLogo}>
                  <div style={styles.logoIcon}>
                    <ZionixLogo />
                  </div>
                  <span style={styles.logoText}>Zionix</span>
                </div>
              </div>

              {/* Form Content */}
              <div style={styles.formContent}>
                <Title level={1} style={styles.title}>
                  Log in to your Account
                </Title>
                {/* <Text style={styles.subtitle}>Welcome back!</Text> */}

                {/* Divider */}
                <Divider style={styles.divider}>
                  <Text style={styles.dividerText}>Continue with email</Text>
                </Divider>

                {/* Login Form */}
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  autoComplete="off"
                >
                  {/* Email Field */}
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                    style={styles.formItem}
                  >
                    <Input
                      prefix={
                        <i className="ri-mail-line" style={styles.inputIcon} />
                      }
                      placeholder="Email"
                      style={styles.input}
                      autoComplete="email"
                    />
                  </Form.Item>

                  {/* Password Field */}
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter your password' },
                    ]}
                    style={styles.formItem}
                  >
                    <Input.Password
                      prefix={
                        <i className="ri-lock-line" style={styles.inputIcon} />
                      }
                      placeholder="Password"
                      style={styles.input}
                      iconRender={(visible) =>
                        visible ? (
                          <i className="ri-eye-line" />
                        ) : (
                          <i className="ri-eye-off-line" />
                        )
                      }
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  {/* Remember Me & Forgot Password */}
                  <div style={styles.rememberForgotContainer}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={styles.checkbox}>Remember me</Checkbox>
                    </Form.Item>
                    <Link
                      onClick={handleForgotPasswordClick}
                      style={styles.forgotLink}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={styles.loginButton}
                    block
                  >
                    Log In
                  </Button>
                </Form>

                {/* Sign Up Link */}
                <div style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>
                    Don't have an account?{' '}
                    <Link onClick={handleSignUpClick} style={styles.signUpLink}>
                      Create an account
                    </Link>
                  </Text>
                </div>
              </div>
            </motion.div>
          </Col>

          {/* Right Side - Promotional Carousel */}
          <Col span={12} style={styles.rightColumn}>
            <motion.div
              style={styles.promoContainer}
              variants={promoVariants}
              initial="initial"
              animate="animate"
            >
              {/* Floating UI Elements Background */}
              <div style={styles.floatingElements}>
                {/* Security Shield Icon */}
                <div style={styles.floatingIcon1}>
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-shield-check-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </div>

                {/* Lock/Encryption Icon */}
                <div style={styles.floatingIcon2}>
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-lock-2-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </div>

                {/* Certificate/Verification Icon */}
                <div style={styles.floatingIcon3}>
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-verified-badge-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </div>
              </div>

              {/* Carousel Content */}
              <div style={styles.carouselContainer}>
                <Carousel
                  autoplay
                  autoplaySpeed={4000}
                  dots={{ className: 'custom-carousel-dots' }}
                  effect="fade"
                  pauseOnHover
                  style={styles.carousel}
                >
                  {carouselSlides.map((slide) => (
                    <div key={slide.id}>
                      <motion.div
                        style={styles.slideContent}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Slide Illustration */}
                        <div style={styles.slideIllustration}>
                          <div style={styles.slideIconContainer}>
                            <div style={styles.slideMainIcon}>{slide.icon}</div>
                          </div>

                          {/* Feature Icons */}
                          <div style={styles.featureIcons}>
                            <div style={styles.featureIcon}>
                              <i className="ri-user-line" />
                            </div>
                            <div style={styles.featureIcon}>
                              <i className="ri-shield-star-line" />
                            </div>
                            <div style={styles.featureIcon}>
                              <i className="ri-links-line" />
                            </div>
                          </div>
                        </div>

                        {/* Slide Text Content */}
                        <div style={styles.slideTextContent}>
                          <Title level={2} style={styles.slideTitle}>
                            {slide.title}
                          </Title>
                          <Text style={styles.slideDescription}>
                            {slide.description}
                          </Text>
                          <Button
                            type="link"
                            style={styles.learnMoreButton}
                            onClick={() =>
                              console.log(`Learn more about ${slide.title}`)
                            }
                          >
                            Learn more
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </motion.div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoginPage;
