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
  BaseForm,
  BaseInput,
  BaseButton,
  BaseTypography,
  BaseDivider,
  baseMessage,
  BaseCheckbox,
  BaseRow,
  BaseCol,
  BaseCarousel,
  useTheme,
  ZionixLogo,
} from '@zionix-space/design-system';
import { motion } from 'framer-motion';
import { CardTopLoader } from '@zionix-space/design-system';
import { SvgLogin } from '@zionix-space/illusion';
import {
  useStyles,
  containerVariants,
  formVariants,
  promoVariants,
  logoVariants,
  titleVariants,
  inputVariants,
  buttonVariants,
  securityIconVariants,
  carouselCustomCSS,
} from './LoginPage.style';

const { Text, Link, Title } = BaseTypography;

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
  const [form] = BaseForm.useForm();
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
      baseMessage.error(errorMessage);
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
          style={{ ...styles.mobileFormContainer, position: 'relative' }}
          variants={formVariants}
          initial="initial"
          animate="animate"
        >
          {/* Card Top Loader */}
          <CardTopLoader show={loading} />

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
            <Title level={5} style={styles.mobileTitle}>
              Log in to your Account
            </Title>
            {/* <Text style={styles.mobileSubtitle}>
              Welcome back! Select method to log in:
            </Text> */}

            {/* Divider */}
            <BaseDivider style={styles.divider}>
              <Text style={styles.dividerText}>Continue with email</Text>
            </BaseDivider>

            {/* Login Form */}
            <BaseForm
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              {/* Email Field */}
              <BaseForm.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                style={styles.formItem}
              >
                <BaseInput
                  prefix={
                    <i className="ri-mail-line" style={styles.inputIcon} />
                  }
                  placeholder="Email"
                  style={styles.input}
                  autoComplete="email"
                />
              </BaseForm.Item>

              {/* Password Field */}
              <BaseForm.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
                style={styles.formItem}
              >
                <BaseInput.Password
                  prefix={
                    <i className="ri-lock-line" style={styles.inputIcon} />
                  }
                  placeholder="Password"
                  style={styles.input}
                  autoComplete="current-password"
                />
              </BaseForm.Item>

              {/* Remember Me & Forgot Password */}
              <div style={styles.rememberForgotContainer}>
                <BaseForm.Item name="remember" valuePropName="checked" noStyle>
                  <BaseCheckbox style={styles.checkbox}>Remember me</BaseCheckbox>
                </BaseForm.Item>
                <Link
                  onClick={handleForgotPasswordClick}
                  style={styles.forgotLink}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <BaseButton
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.loginButton}
                block
              >
                Log In
              </BaseButton>
            </BaseForm>

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
        <BaseRow style={styles.row}>
          {/* Left Side - Login Form */}
          <BaseCol span={12} style={styles.leftColumn}>
            <motion.div
              style={{ ...styles.formContainer, position: 'relative' }}
              variants={formVariants}
              initial="initial"
              animate="animate"
            >
              {/* Card Top Loader */}
              <CardTopLoader show={loading} />

              {/* Logo */}
              <motion.div
                style={styles.logo}
                variants={logoVariants}
              >
                <div style={styles.dotworkLogo}>
                  <motion.div
                    style={styles.logoIcon}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <ZionixLogo />
                  </motion.div>
                  <span style={styles.logoText}>Zionix</span>
                </div>
              </motion.div>

              {/* Form Content */}
              <div style={styles.formContent}>
                <motion.div variants={titleVariants}>
                  <Title level={1} style={styles.title}>
                    Log in to your Account
                  </Title>
                </motion.div>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <BaseDivider style={styles.divider}>
                    <Text style={styles.dividerText}>Continue with email</Text>
                  </BaseDivider>
                </motion.div>

                {/* Login Form */}
                <BaseForm
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  autoComplete="off"
                >
                  {/* Email Field */}
                  <motion.div
                    custom={0}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <BaseForm.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                      style={styles.formItem}
                    >
                      <BaseInput
                        prefix={
                          <i className="ri-mail-line" style={styles.inputIcon} />
                        }
                        placeholder="Email"
                        style={styles.input}
                        autoComplete="email"
                      />
                    </BaseForm.Item>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <BaseForm.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please enter your password' },
                      ]}
                      style={styles.formItem}
                    >
                      <BaseInput.Password
                        prefix={
                          <motion.i
                            className="ri-lock-line"
                            style={styles.inputIcon}
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                          />
                        }
                        placeholder="Password"
                        style={styles.input}
                        autoComplete="current-password"
                      />
                    </BaseForm.Item>
                  </motion.div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    style={styles.rememberForgotContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <BaseForm.Item name="remember" valuePropName="checked" noStyle>
                      <BaseCheckbox style={styles.checkbox}>Remember me</BaseCheckbox>
                    </BaseForm.Item>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        onClick={handleForgotPasswordClick}
                        style={styles.forgotLink}
                      >
                        Forgot Password?
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Login Button */}
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <BaseButton
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      shape='round'
                      style={styles.loginButton}
                      block
                    >
                      Log In
                    </BaseButton>
                  </motion.div>
                </BaseForm>
              </div>
            </motion.div>
          </BaseCol>

          {/* Right Side - Promotional Carousel */}
          <BaseCol span={12} style={styles.rightColumn}>
            <motion.div
              style={styles.promoContainer}
              variants={promoVariants}
              initial="initial"
              animate="animate"
            >
              {/* Floating UI Elements Background */}
              <div style={styles.floatingElements}>
                {/* Security Shield Icon */}
                <motion.div
                  style={styles.floatingIcon1}
                  variants={securityIconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-shield-check-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </motion.div>

                {/* Lock/Encryption Icon */}
                <motion.div
                  style={styles.floatingIcon2}
                  variants={securityIconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: 0.2 }}
                >
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-lock-2-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </motion.div>

                {/* Certificate/Verification Icon */}
                <motion.div
                  style={styles.floatingIcon3}
                  variants={securityIconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: 0.4 }}
                >
                  <div style={styles.iconCircle} className="icon-circle">
                    <i
                      className="ri-verified-badge-fill"
                      style={styles.floatingIconContent}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Carousel Content */}
              <div style={styles.carouselContainer}>
                <BaseCarousel
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
                          <SvgLogin
                            height="300px"
                            primarycolor={token.colorPrimary}
                            accentcolor={token.colorTextSecondary}
                            haircolor={token.border}
                            skincolor={token.colorPrimaryBg}
                          />
                        </div>

                        {/* Slide Text Content */}
                        <div style={styles.slideTextContent}>
                          <Title level={2} style={styles.slideTitle}>
                            {slide.title}
                          </Title>
                          <Text style={styles.slideDescription}>
                            {slide.description}
                          </Text>
                          <BaseButton
                            type="link"
                            style={styles.learnMoreButton}
                            onClick={() =>
                              console.log(`Learn more about ${slide.title}`)
                            }
                          >
                            Learn more
                          </BaseButton>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </BaseCarousel>
              </div>
            </motion.div>
          </BaseCol>
        </BaseRow>
      </div>
    </>
  );
};

export default LoginPage;
