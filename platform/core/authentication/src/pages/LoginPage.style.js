import { useMemo } from 'react';

/**
 * Modern Split-Screen Login Page Styles
 * Professional design with split layout, social login, and promotional content
 * Responsive design with proper zoom handling and fluid typography
 * Note: CSS-in-JS compatible - no @media queries or pseudo-selectors
 */
export const useStyles = (token) => {
  return useMemo(
    () => ({
      // Main container for desktop split-screen layout
      container: {
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: token.fontFamily,
        minHeight: '600px',
      },

      // Row container
      row: {
        height: '100%',
        margin: 0,
        minHeight: 'inherit',
      },

      // Left column - Mica-style subtle tinted background
      leftColumn: {
        height: '100vh',
        padding: 0,
        // Subtle tint using theme colors - Windows 11 Mica style
        backgroundColor: token.colorBgLayout,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'inherit',
      },

      // Right column - Theme-based gradient (not hardcoded blue)
      rightColumn: {
        height: '100vh',
        padding: 0,
        background: `linear-gradient(135deg, ${token.colorPrimaryActive} 0%, ${token.colorPrimary} 50%, ${token.colorPrimaryHover} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'inherit',
      },

      // Form container - subtle card with minimal styling
      formContainer: {
        width: '100%',
        maxWidth: 'min(25rem, 90vw)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        backgroundColor: token.colorBgContainer,
        borderRadius: '16px',
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: `0 1px 3px 0 rgba(0, 0, 0, 0.04)`,
      },

      // Logo section
      logo: {
        marginBottom: 'clamp(2rem, 5vw, 3rem)',
      },

      // Dotwork logo
      dotworkLogo: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
      },

      // Logo icon
      logoIcon: {
        width: 'clamp(1.75rem, 3vw, 2rem)',
        height: 'clamp(1.75rem, 3vw, 2rem)',
        borderRadius: 'clamp(0.25rem, 1vw, 0.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: token.colorWhite,
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        fontWeight: 'bold',
      },

      // Logo text
      logoText: {
        fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
        fontWeight: '600',
        color: token.colorText,
      },

      // Form content
      formContent: {
        width: '100%',
      },

      // Main title
      title: {
        fontSize: 'clamp(1.5rem, 3.5vw, 1rem)',
        fontWeight: '700',
        color: token.colorText,
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },

      // Subtitle
      subtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: token.colorTextSecondary,
        marginBottom: '2rem',
        lineHeight: '1.5',
      },

      // Social buttons container
      socialButtons: {
        display: 'flex',
        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        marginBottom: '1.5rem',
      },

      // Social login button
      socialButton: {
        flex: 1,
        height: 'clamp(2.5rem, 5vw, 3rem)',
        borderRadius: 'clamp(0.25rem, 1vw, 0.5rem)',
        border: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        color: token.colorText,
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
        transition: 'all 0.2s ease',
        boxShadow: `0 1px 2px 0 ${token.colorBgLayout}`,
        minHeight: '2.5rem',
        cursor: 'pointer',
      },

      // Social button hover state (to be applied via React state)
      socialButtonHover: {
        borderColor: token.colorBorderSecondary,
        backgroundColor: token.colorBgTextHover,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 6px -1px ${token.colorBgLayout}`,
      },

      // Divider
      divider: {
        margin: '1.5rem 0',
        borderColor: token.colorBorder,
      },

      // Divider text
      dividerText: {
        color: token.colorTextSecondary,
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        padding: '0 clamp(0.75rem, 2vw, 1rem)',
      },

      // Form item
      formItem: {
        marginBottom: '1rem',
      },

      // Input field - clean with subtle depth
      input: {
        height: 'clamp(2.5rem, 5vw, 3rem)',
        borderRadius: '8px',
        border: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
        padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '2.5rem',
      },

      // Input focus state - clean accent ring
      inputFocus: {
        borderColor: token.colorPrimary,
        boxShadow: `0 0 0 2px ${token.colorPrimaryBg}`,
      },

      // Input icon
      inputIcon: {
        color: token.colorTextSecondary,
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
      },

      // Remember me and forgot password container
      rememberForgotContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: 'clamp(0.5rem, 1vw, 1rem)',
      },

      // Checkbox
      checkbox: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: token.colorText,
      },

      // Forgot password link
      forgotLink: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: token.colorPrimary,
        fontWeight: '500',
        textDecoration: 'none',
        cursor: 'pointer',
      },

      // Forgot link hover state (to be applied via React state)
      forgotLinkHover: {
        color: token.colorPrimaryHover,
        textDecoration: 'underline',
      },

      // Login button - solid with subtle elevation
      loginButton: {
        width: '100%',
        height: '48px',
        backgroundColor: token.colorPrimary,
        color: token.colorWhite,
        border: 'none',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`,
        '&:hover': {
          backgroundColor: token.colorPrimaryHover,
          boxShadow: `0 2px 4px 0 rgba(0, 0, 0, 0.1)`,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },

      // Login button hover state (to be applied via React state)
      loginButtonHover: {
        backgroundColor: token.colorPrimaryHover,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${token.colorPrimaryBg}`,
      },

      // Login button disabled state
      loginButtonDisabled: {
        backgroundColor: token.colorTextSecondary,
        transform: 'none',
        boxShadow: 'none',
        cursor: 'not-allowed',
      },

      // Sign up container
      signUpContainer: {
        textAlign: 'center',
      },

      // Sign up text
      signUpText: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: token.colorTextSecondary,
      },

      // Sign up link
      signUpLink: {
        color: token.colorPrimary,
        fontWeight: '500',
        textDecoration: 'none',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        cursor: 'pointer',
      },

      // Sign up link hover state (to be applied via React state)
      signUpLinkHover: {
        color: token.colorPrimaryHover,
        textDecoration: 'underline',
      },

      // Promotional container
      promoContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 'clamp(2rem, 6vw, 3.75rem)',
        minHeight: 'inherit',
      },

      // Floating elements container
      floatingElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      },

      // Floating icon 1 (Google)
      floatingIcon1: {
        position: 'absolute',
        top: 'clamp(15%, 20%, 25%)',
        left: 'clamp(10%, 15%, 20%)',
      },

      // Floating icon 2 (Play)
      floatingIcon2: {
        position: 'absolute',
        top: 'clamp(30%, 35%, 40%)',
        left: 'clamp(20%, 25%, 30%)',
      },

      // Floating icon 3 (Chrome)
      floatingIcon3: {
        position: 'absolute',
        top: 'clamp(50%, 55%, 60%)',
        left: 'clamp(15%, 20%, 25%)',
      },

      // Icon circle - premium glow with better visibility
      iconCircle: {
        width: 'clamp(2rem, 6vw, 3.75rem)',
        height: 'clamp(2rem, 6vw, 3.75rem)',
        borderRadius: '50%',
        backgroundColor: `${token.colorWhite}33`, // 20% opacity
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${token.colorWhite}4D`, // 30% opacity
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
        animation: 'floatGentle 6s ease-in-out infinite',
        transition: 'all 0.3s ease',
      },

      // Icon circle hover state (to be applied via React state)
      iconCircleHover: {
        transform: 'scale(1.1)',
        backgroundColor: `${token.colorWhite}4D`, // 30% opacity
      },

      // Floating icon content
      floatingIconContent: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        color: token.colorWhite,
      },

      // Play icon
      playIcon: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: token.colorWhite,
        marginLeft: '2px',
      },

      // Chrome icon
      chromeIcon: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        color: token.colorWhite,
        fontWeight: 'bold',
      },

      // Dashboard card
      dashboardCard: {
        position: 'absolute',
        top: 'clamp(20%, 25%, 30%)',
        right: 'clamp(5%, 10%, 15%)',
        width: 'clamp(16rem, 25vw, 17.5rem)',
        height: 'clamp(10rem, 18vw, 12.5rem)',
        backgroundColor: `${token.colorWhite}F2`, // 95% opacity
        borderRadius: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        boxShadow: `0 20px 40px ${token.colorBgLayout}`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${token.colorWhite}33`, // 20% opacity
      },

      // Card header
      cardHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
      },

      // Card dots
      cardDots: {
        display: 'flex',
        gap: 'clamp(0.125rem, 0.5vw, 0.25rem)',
      },

      // Dot
      dot: {
        width: 'clamp(0.375rem, 1vw, 0.5rem)',
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        borderRadius: '50%',
        backgroundColor: token.colorBorder,
        display: 'block',
      },

      // Card content
      cardContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
      },

      // Card row
      cardRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
      },

      // Avatar
      avatar: {
        width: 'clamp(1.5rem, 3vw, 2rem)',
        height: 'clamp(1.5rem, 3vw, 2rem)',
        borderRadius: '50%',
        backgroundColor: token.colorBgTextHover,
      },

      // Card text
      cardText: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(0.125rem, 0.5vw, 0.25rem)',
      },

      // Card line
      cardLine: {
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        backgroundColor: token.colorBorder,
        borderRadius: 'clamp(0.125rem, 0.5vw, 0.25rem)',
        width: '100%',
      },

      // Card line short
      cardLineShort: {
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        backgroundColor: token.colorBgTextHover,
        borderRadius: 'clamp(0.125rem, 0.5vw, 0.25rem)',
        width: '60%',
      },

      // Promotional content
      promoContent: {
        textAlign: 'center',
        zIndex: 1,
        position: 'relative',
        maxWidth: '90%',
        margin: '0 auto',
      },

      // Promo title - clean with subtle depth
      promoTitle: {
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        fontWeight: '700',
        color: token.colorWhite,
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        lineHeight: '1.1',
        textShadow: `0 2px 8px rgba(0, 0, 0, 0.24)`,
      },

      // Promo subtitle
      promoSubtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
        color: `${token.colorWhite}E6`, // 90% opacity
        marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
        lineHeight: '1.6',
        maxWidth: '100%',
      },

      // Navigation dots
      navDots: {
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
      },

      // Active dot
      activeDot: {
        width: 'clamp(0.375rem, 1vw, 0.5rem)',
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        borderRadius: '50%',
        backgroundColor: token.colorWhite,
      },

      // Inactive dot
      inactiveDot: {
        width: 'clamp(0.375rem, 1vw, 0.5rem)',
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        borderRadius: '50%',
        backgroundColor: `${token.colorWhite}66`, // 40% opacity
      },

      // Mobile container - clean background
      mobileContainer: {
        height: '100vh',
        width: '100vw',
        backgroundColor: token.colorBgLayout,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 1.25rem)',
        minHeight: '100vh',
      },

      // Mobile form container - subtle card
      mobileFormContainer: {
        width: '100%',
        maxWidth: 'min(25rem, 95vw)',
        backgroundColor: token.colorBgContainer,
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 4vw, 2rem)',
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: `0 1px 3px 0 rgba(0, 0, 0, 0.04)`,
      },

      // Mobile logo
      mobileLogo: {
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        placeSelf: 'center',
      },

      // Mobile form content
      mobileFormContent: {
        width: '100%',
      },

      // Mobile title
      mobileTitle: {
        fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
        fontWeight: '700',
        color: token.colorText,
        marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
        textAlign: 'center',
        lineHeight: '1.2',
      },

      // Mobile subtitle
      mobileSubtitle: {
        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
        color: token.colorTextSecondary,
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
        textAlign: 'center',
        lineHeight: '1.5',
      },

      // Carousel container
      carouselContainer: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        minHeight: 'inherit',
      },

      // Carousel
      carousel: {
        width: '100%',
        maxWidth: 'clamp(25rem, 40vw, 31.25rem)',
        height: '100%',
        minHeight: 'inherit',
      },

      // Slide content
      slideContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 2vw, 1.25rem)',
        height: '100%',
        minHeight: 'clamp(25rem, 50vh, 31.25rem)',
      },

      // Slide illustration
      slideIllustration: {
        position: 'relative',
        marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },

      // Slide icon container
      slideIconContainer: {
        position: 'relative',
        zIndex: 2,
      },

      // Slide main icon - premium glass with depth
      slideMainIcon: {
        width: 'clamp(6rem, 12vw, 7.5rem)',
        height: 'clamp(6rem, 12vw, 7.5rem)',
        borderRadius: '50%',
        backgroundColor: `${token.colorWhite}33`, // 20% opacity
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${token.colorWhite}4D`, // 30% opacity
        boxShadow: `0 16px 48px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        color: token.colorWhite,
      },

      // Feature icons
      featureIcons: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'clamp(10rem, 20vw, 12.5rem)',
        height: 'clamp(10rem, 20vw, 12.5rem)',
        pointerEvents: 'none',
      },

      // Feature icon - subtle glass effect
      featureIcon: {
        position: 'absolute',
        width: 'clamp(2rem, 4vw, 2.5rem)',
        height: 'clamp(2rem, 4vw, 2.5rem)',
        borderRadius: '50%',
        backgroundColor: `${token.colorWhite}26`, // 15% opacity
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${token.colorWhite}33`, // 20% opacity
        boxShadow: `0 4px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.08) inset`,
        fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
        color: token.colorWhite,
      },

      // Feature icon positions (to be applied conditionally)
      featureIcon1: {
        top: 'clamp(0.5rem, 1vw, 0.625rem)',
        right: 'clamp(1rem, 2vw, 1.25rem)',
      },

      featureIcon2: {
        bottom: 'clamp(1rem, 2vw, 1.25rem)',
        left: 'clamp(0.5rem, 1vw, 0.625rem)',
      },

      featureIcon3: {
        top: '50%',
        right: '0px',
        transform: 'translateY(-50%)',
      },

      // Slide text content
      slideTextContent: {
        maxWidth: '100%',
        margin: '0 auto',
      },

      // Slide title - clean with subtle depth
      slideTitle: {
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        fontWeight: '700',
        color: token.colorWhite,
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        lineHeight: '1.2',
        textShadow: `0 2px 8px rgba(0, 0, 0, 0.24)`,
      },

      // Slide description
      slideDescription: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: `${token.colorWhite}E6`, // 90% opacity
        lineHeight: '1.6',
        maxWidth: '100%',
      },

      // Learn more button
      learnMoreButton: {
        color: token.colorWhite,
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        fontWeight: 500,
        padding: 0,
        height: 'auto',
        marginTop: 'clamp(0.5rem, 1.5vw, 1rem)',
      },
    }),
    [token]
  );
};

// CSS animations and carousel styles (kept separate as they need to be injected as CSS)
export const carouselCustomCSS = `
  @keyframes floatGentle {
    0%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 0.8;
    }
    25% {
      transform: translateY(-8px) scale(1.02);
      opacity: 0.9;
    }
    50% {
      transform: translateY(-12px) scale(1.05);
      opacity: 1;
    }
    75% {
      transform: translateY(-8px) scale(1.02);
      opacity: 0.9;
    }
  }

  @keyframes breathe {
    0%, 100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }

  .login-carousel .ant-carousel .ant-carousel-dots {
    bottom: clamp(1rem, 2.5vw, 1.25rem);
  }

  .login-carousel .ant-carousel .ant-carousel-dots li {
    width: clamp(0.75rem, 1.5vw, 0.875rem);
    height: clamp(0.75rem, 1.5vw, 0.875rem);
    margin: 0 clamp(0.25rem, 0.75vw, 0.375rem);
  }

  .login-carousel .ant-carousel .ant-carousel-dots li button {
    width: clamp(0.75rem, 1.5vw, 0.875rem);
    height: clamp(0.75rem, 1.5vw, 0.875rem);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
  }

  .login-carousel .ant-carousel .ant-carousel-dots li.ant-carousel-dot-active button {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 1);
    transform: scale(1.2);
  }

  .login-carousel .ant-carousel .ant-carousel-dots li:hover button {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }

  @media (max-width: 1400px) {
    .login-carousel .ant-carousel .ant-carousel-dots {
      bottom: clamp(0.75rem, 2vw, 1rem);
    }
  }

  @media (max-width: 1200px) {
    .login-carousel .ant-carousel .ant-carousel-dots {
      bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    }
  }
`;

// Animation variants for framer-motion
export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const formVariants = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2,
    },
  },
};

export const promoVariants = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4,
    },
  },
};
