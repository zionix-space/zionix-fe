/**
 * @fileoverview Authentication Layout Component for Zionix Platform
 *
 * Responsive layout component that provides consistent structure for all
 * authentication pages with mobile-native feel using Framer Motion animations.
 * Integrates with the Zionix design system and theme provider.
 *
 * @author Zionix Authentication Team
 * @version 1.0.0
 */

import React from 'react';
import { Layout, Card, Typography, Space } from 'antd';
import { motion } from 'framer-motion';
import { useTheme, ZionixLogo } from '@zionix/design-system';
import { useStyles, layoutVariants, cardVariants, logoVariants } from './AuthLayout.style';

const { Content } = Layout;
const { Title, Text } = Typography;

/**
 * Authentication Layout Component
 *
 * Provides consistent layout structure for authentication pages with:
 * - Responsive design for mobile and desktop
 * - Smooth animations using Framer Motion
 * - Integration with Zionix design system
 * - Mobile-native feel and interactions
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {boolean} props.showLogo - Whether to show the Zionix logo
 * @returns {JSX.Element} Authentication layout
 */
const AuthLayout = ({ children, title, subtitle, footer, showLogo = true }) => {
  const { token, isMobile, isDarkMode } = useTheme();
  const styles = useStyles(token);

  /**
   * Get responsive styles based on device type
   */
  const layoutStyle = isMobile ? styles.mobileLayoutContainerStyle : styles.desktopLayoutContainerStyle;
  const containerStyle = isMobile ? styles.mobileContainerStyle : styles.desktopContainerStyle;
  const cardStyle = isMobile ? styles.mobileCardStyle : styles.desktopCardStyle;
  const headerStyle = isMobile ? styles.mobileHeaderContainerStyle : styles.desktopHeaderContainerStyle;
  const titleStyle = isMobile ? styles.mobileTitleStyle : styles.desktopTitleStyle;
  const subtitleStyle = isMobile ? styles.mobileSubtitleStyle : styles.desktopSubtitleStyle;
  const logoContainerStyle = isMobile ? styles.mobileLogoContainerStyle : styles.desktopLogoContainerStyle;
  const footerStyle = isMobile ? styles.mobileFooterContainerStyle : styles.desktopFooterContainerStyle;

  return (
    <Layout style={layoutStyle}>
      <Content>
        <motion.div
          style={containerStyle}
          variants={layoutVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div variants={cardVariants}>
            <Card
              style={cardStyle}
              variant="borderless"
              styles={{ body: { padding: 0 } }}
            >
              {/* Logo Section */}
              {showLogo && (
                <motion.div style={logoContainerStyle} variants={logoVariants}>
                  <ZionixLogo size={isMobile ? 48 : 56} variant="full" />
                </motion.div>
              )}

              {/* Header Section */}
              {(title || subtitle) && (
                <div style={headerStyle}>
                  {title && (
                    <Title level={isMobile ? 3 : 2} style={titleStyle}>
                      {title}
                    </Title>
                  )}
                  {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
                </div>
              )}

              {/* Main Content */}
              <motion.div
                style={styles.contentWrapperStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
              >
                {children}
              </motion.div>

              {/* Footer Section */}
              {footer && (
                <motion.div
                  style={footerStyle}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      delay: 0.4,
                    },
                  }}
                >
                  {footer}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
