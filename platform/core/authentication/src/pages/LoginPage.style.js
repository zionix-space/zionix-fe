import { useMemo } from "react";

/**
 * Modern Split-Screen Login Page Styles
 * Professional design with split layout, social login, and promotional content
 * Matches target design exactly with dotwork branding and blue gradient
 */
export const useStyles = (token) => {
  return useMemo(() => ({
    // Main container for desktop split-screen layout
    container: {
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      fontFamily: token.fontFamily,
    },

    // Row container
    row: {
      height: '100%',
      margin: 0,
    },

    // Left column - Login form
    leftColumn: {
      height: '100vh',
      padding: 0,
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Right column - Promotional content
    rightColumn: {
      height: '100vh',
      padding: 0,
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
      position: 'relative',
      overflow: 'hidden',
    },

    // Form container
    formContainer: {
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
    },

    // Logo section
    logo: {
      marginBottom: '48px',
    },

    // Dotwork logo
    dotworkLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    // Logo icon
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#3b82f6',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: 'bold',
    },

    // Logo text
    logoText: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
    },

    // Form content
    formContent: {
      width: '100%',
    },

    // Main title
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
      lineHeight: '1.2',
    },

    // Subtitle
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '32px',
      lineHeight: '1.5',
    },

    // Social buttons container
    socialButtonsContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },

    // Social login button
    socialButton: {
      flex: 1,
      height: '48px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      '&:hover': {
        borderColor: '#d1d5db',
        backgroundColor: '#f9fafb',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },

    // Divider
    divider: {
      margin: '24px 0',
      borderColor: '#e5e7eb',
    },

    // Divider text
    dividerText: {
      color: '#9ca3af',
      fontSize: '14px',
      padding: '0 16px',
    },

    // Form item
    formItem: {
      marginBottom: '20px',
    },

    // Input field
    input: {
      height: '48px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      fontSize: '16px',
      padding: '12px 16px',
      transition: 'all 0.2s ease',
      '&:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      '&::placeholder': {
        color: '#9ca3af',
      },
    },

    // Input icon
    inputIcon: {
      color: '#9ca3af',
      fontSize: '16px',
    },

    // Remember me and forgot password container
    rememberForgotContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },

    // Checkbox
    checkbox: {
      fontSize: '14px',
      color: '#374151',
    },

    // Forgot password link
    forgotLink: {
      fontSize: '14px',
      color: '#3b82f6',
      fontWeight: '500',
      textDecoration: 'none',
      '&:hover': {
        color: '#2563eb',
        textDecoration: 'underline',
      },
    },

    // Login button
    loginButton: {
      height: '48px',
      borderRadius: '8px',
      backgroundColor: '#3b82f6',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '24px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#2563eb',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      },
      '&:disabled': {
        backgroundColor: '#9ca3af',
        transform: 'none',
        boxShadow: 'none',
      },
    },

    // Sign up container
    signUpContainer: {
      textAlign: 'center',
    },

    // Sign up text
    signUpText: {
      fontSize: '14px',
      color: '#6b7280',
    },

    // Sign up link
    signUpLink: {
      color: '#3b82f6',
      fontWeight: '500',
      textDecoration: 'none',
      '&:hover': {
        color: '#2563eb',
        textDecoration: 'underline',
      },
    },

    // Promotional container
    promoContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      padding: '60px',
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
      top: '20%',
      left: '15%',
    },

    // Floating icon 2 (Play)
    floatingIcon2: {
      position: 'absolute',
      top: '35%',
      left: '25%',
    },

    // Floating icon 3 (Chrome)
    floatingIcon3: {
      position: 'absolute',
      top: '55%',
      left: '20%',
    },

    // Icon circle
    iconCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },

    // Floating icon content
    floatingIconContent: {
      fontSize: '24px',
      color: '#ffffff',
    },

    // Play icon
    playIcon: {
      fontSize: '20px',
      color: '#ffffff',
      marginLeft: '2px',
    },

    // Chrome icon
    chromeIcon: {
      fontSize: '24px',
      color: '#ffffff',
      fontWeight: 'bold',
    },

    // Dashboard card
    dashboardCard: {
      position: 'absolute',
      top: '25%',
      right: '10%',
      width: '280px',
      height: '200px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },

    // Card header
    cardHeader: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '16px',
    },

    // Card dots
    cardDots: {
      display: 'flex',
      gap: '4px',
    },

    // Dot
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      display: 'block',
    },

    // Card content
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    // Card row
    cardRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    // Avatar
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
    },

    // Card text
    cardText: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },

    // Card line
    cardLine: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      width: '100%',
    },

    // Card line short
    cardLineShort: {
      height: '8px',
      backgroundColor: '#f3f4f6',
      borderRadius: '4px',
      width: '60%',
    },

    // Promotional content
    promoContent: {
      textAlign: 'center',
      zIndex: 1,
      position: 'relative',
    },

    // Promo title
    promoTitle: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      lineHeight: '1.1',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },

    // Promo subtitle
    promoSubtitle: {
      fontSize: '18px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '40px',
      lineHeight: '1.6',
      maxWidth: '400px',
    },

    // Navigation dots
    navDots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
    },

    // Active dot
    activeDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
    },

    // Inactive dot
    inactiveDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },

    // Mobile container
    mobileContainer: {
      height: '100vh',
      width: '100vw',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },

    // Mobile form container
    mobileFormContainer: {
      width: '100%',
      maxWidth: '400px',
    },

    // Mobile logo
    mobileLogo: {
      textAlign: 'center',
      marginBottom: '32px',
    },

    // Mobile form content
    mobileFormContent: {
      width: '100%',
    },

    // Mobile title
    mobileTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px',
      textAlign: 'center',
      lineHeight: '1.2',
    },

    // Mobile subtitle
     mobileSubtitle: {
       fontSize: '16px',
       color: '#6b7280',
       marginBottom: '32px',
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
       padding: '40px',
     },

     // Carousel
     carousel: {
       width: '100%',
       maxWidth: '500px',
       height: '100%',
     },

     // Slide content
     slideContent: {
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       justifyContent: 'center',
       textAlign: 'center',
       padding: '40px 20px',
       height: '100%',
       minHeight: '500px',
     },

     // Slide illustration
     slideIllustration: {
       position: 'relative',
       marginBottom: '40px',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
     },

     // Slide icon container
     slideIconContainer: {
       position: 'relative',
       zIndex: 2,
     },

     // Slide main icon
     slideMainIcon: {
       width: '120px',
       height: '120px',
       borderRadius: '50%',
       backgroundColor: 'rgba(255, 255, 255, 0.2)',
       backdropFilter: 'blur(20px)',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       border: '2px solid rgba(255, 255, 255, 0.3)',
       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
       fontSize: '48px',
       color: '#ffffff',
     },

     // Feature icons
     featureIcons: {
       position: 'absolute',
       top: '50%',
       left: '50%',
       transform: 'translate(-50%, -50%)',
       width: '200px',
       height: '200px',
       pointerEvents: 'none',
     },

     // Feature icon
     featureIcon: {
       position: 'absolute',
       width: '40px',
       height: '40px',
       borderRadius: '50%',
       backgroundColor: 'rgba(255, 255, 255, 0.15)',
       backdropFilter: 'blur(10px)',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       border: '1px solid rgba(255, 255, 255, 0.2)',
       fontSize: '16px',
       color: '#ffffff',
       '&:nth-child(1)': {
         top: '10px',
         right: '20px',
         animationDelay: '0s',
       },
       '&:nth-child(2)': {
         bottom: '20px',
         left: '10px',
         animationDelay: '1s',
       },
       '&:nth-child(3)': {
         top: '50%',
         right: '0px',
         transform: 'translateY(-50%)',
         animationDelay: '2s',
       },
     },

     // Slide text content
     slideTextContent: {
       maxWidth: '400px',
       margin: '0 auto',
     },

     // Slide title
     slideTitle: {
       fontSize: '36px',
       fontWeight: '700',
       color: '#ffffff',
       marginBottom: '16px',
       lineHeight: '1.2',
       textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
     },

     // Slide description
     slideDescription: {
       fontSize: '16px',
       color: 'rgba(255, 255, 255, 0.9)',
       lineHeight: '1.6',
       marginBottom: '24px',
     },

     // Learn more button
     learnMoreButton: {
       color: '#ffffff',
       fontSize: '16px',
       fontWeight: '500',
       padding: '8px 0',
       height: 'auto',
       textDecoration: 'underline',
       '&:hover': {
         color: 'rgba(255, 255, 255, 0.8)',
         textDecoration: 'underline',
       },
     },
   }), [token]);
 };

// Custom CSS for Ant Design Carousel
export const carouselCustomCSS = `
  .login-carousel .ant-carousel .ant-carousel-dots {
    bottom: 20px;
  }

  .login-carousel .ant-carousel .ant-carousel-dots li {
    width: 12px;
    height: 12px;
    margin: 0 6px;
  }

  .login-carousel .ant-carousel .ant-carousel-dots li button {
    width: 12px;
    height: 12px;
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
`;

// Animation variants
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