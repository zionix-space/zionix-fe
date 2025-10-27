import { useMemo } from 'react';

/**
 * Modern Split-Screen Login Page Styles
 * Professional design with split layout, social login, and promotional content
 * Responsive design with proper zoom handling and fluid typography
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
        '@media (max-width: 1200px)': {
          minHeight: '500px',
        },
        '@media (max-width: 768px)': {
          minHeight: '100vh',
        },
      },

      // Row container
      row: {
        height: '100%',
        margin: 0,
        minHeight: 'inherit',
      },

      // Left column - Login form
      leftColumn: {
        height: '100vh',
        padding: 0,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'inherit',
        '@media (max-width: 1400px)': {
          padding: '0 1rem',
        },
        '@media (max-width: 1200px)': {
          padding: '0 0.5rem',
        },
      },

      // Right column - Promotional content
      rightColumn: {
        height: '100vh',
        padding: 0,
        background:
          'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'inherit',
      },

      // Form container
      formContainer: {
        width: '100%',
        maxWidth: 'min(25rem, 90vw)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        '@media (max-width: 1400px)': {
          maxWidth: 'min(22rem, 85vw)',
          padding: 'clamp(1rem, 3vw, 2rem)',
        },
        '@media (max-width: 1200px)': {
          maxWidth: 'min(20rem, 80vw)',
          padding: 'clamp(0.75rem, 2.5vw, 1.5rem)',
        },
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
        color: '#ffffff',
        fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
        fontWeight: 'bold',
      },

      // Logo text
      logoText: {
        fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
        fontWeight: '600',
        color: '#1f2937',
      },

      // Form content
      formContent: {
        width: '100%',
      },

      // Main title
      title: {
        fontSize: 'clamp(1.5rem, 3.5vw, 1rem)',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        width: 'max-content',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '@media (max-width: 1200px)': {
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
        },
        '@media (max-width: 768px)': {
          fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
          whiteSpace: 'normal',
        },
      },

      // Subtitle
      subtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: '#6b7280',
        marginBottom: '2rem', // 32px - proper spacing before social buttons
        lineHeight: '1.5',
      },

      // Social buttons container
      socialButtons: {
        display: 'flex',
        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        marginBottom: '1.5rem', // 24px - consistent UX spacing
      },

      // Social login button
      socialButton: {
        flex: 1,
        height: 'clamp(2.5rem, 5vw, 3rem)',
        borderRadius: 'clamp(0.25rem, 1vw, 0.5rem)',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        color: '#374151',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(0.25rem, 1vw, 0.5rem)',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        minHeight: '2.5rem',
        '@media (max-width: 1200px)': {
          height: 'clamp(2.25rem, 4vw, 2.75rem)',
          fontSize: 'clamp(0.7rem, 1.25vw, 0.8rem)',
        },
        '&:hover': {
          borderColor: '#d1d5db',
          backgroundColor: '#f9fafb',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },

      // Divider
      divider: {
        margin: '1.5rem 0', // 24px top/bottom - consistent UX spacing
        borderColor: '#e5e7eb',
      },

      // Divider text
      dividerText: {
        color: '#9ca3af',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        padding: '0 clamp(0.75rem, 2vw, 1rem)',
      },

      // Form item
      formItem: {
        marginBottom: '1rem', // 16px - consistent UX spacing for form fields
      },

      // Input field
      input: {
        height: 'clamp(2.5rem, 5vw, 3rem)',
        borderRadius: 'clamp(0.25rem, 1vw, 0.5rem)',
        border: '1px solid #e5e7eb',
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
        padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
        transition: 'all 0.2s ease',
        minHeight: '2.5rem',
        '@media (max-width: 1200px)': {
          height: 'clamp(2.25rem, 4vw, 2.75rem)',
          fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        },
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
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
      },

      // Remember me and forgot password container
      rememberForgotContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem', // 24px - consistent UX spacing
        gap: 'clamp(0.5rem, 1vw, 1rem)',
        '@media (max-width: 1200px)': {
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '0.5rem', // 8px - smaller gap for mobile
        },
      },

      // Checkbox
      checkbox: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#374151',
      },

      // Forgot password link
      forgotLink: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
        height: 'clamp(2.5rem, 5vw, 3rem)',
        borderRadius: 'clamp(0.25rem, 1vw, 0.5rem)',
        backgroundColor: '#3b82f6',
        border: 'none',
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
        fontWeight: '600',
        marginBottom: '2rem', // 32px - larger spacing before sign up text
        transition: 'all 0.2s ease',
        minHeight: '2.5rem',
        '@media (max-width: 1200px)': {
          height: 'clamp(2.25rem, 4vw, 2.75rem)',
          fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        },
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
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#6b7280',
      },

      // Sign up link
      signUpLink: {
        color: '#3b82f6',
        fontWeight: '500',
        textDecoration: 'none',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
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
        padding: 'clamp(2rem, 6vw, 3.75rem)',
        minHeight: 'inherit',
        '@media (max-width: 1400px)': {
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        },
        '@media (max-width: 1200px)': {
          padding: 'clamp(1rem, 3vw, 2rem)',
        },
      },

      // Floating elements container
      floatingElements: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        '@media (max-width: 1400px)': {
          transform: 'scale(0.9)',
        },
        '@media (max-width: 1200px)': {
          transform: 'scale(0.8)',
        },
      },

      // Floating icon 1 (Google)
      floatingIcon1: {
        position: 'absolute',
        top: 'clamp(15%, 20%, 25%)',
        left: 'clamp(10%, 15%, 20%)',
        '& .icon-circle': {
          animationDelay: '0s',
        },
      },

      // Floating icon 2 (Play)
      floatingIcon2: {
        position: 'absolute',
        top: 'clamp(30%, 35%, 40%)',
        left: 'clamp(20%, 25%, 30%)',
        '& .icon-circle': {
          animationDelay: '2s',
        },
      },

      // Floating icon 3 (Chrome)
      floatingIcon3: {
        position: 'absolute',
        top: 'clamp(50%, 55%, 60%)',
        left: 'clamp(15%, 20%, 25%)',
        '& .icon-circle': {
          animationDelay: '4s',
        },
      },

      // Icon circle
      iconCircle: {
        width: 'clamp(3rem, 6vw, 3.75rem)',
        height: 'clamp(3rem, 6vw, 3.75rem)',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'floatGentle 6s ease-in-out infinite',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      },

      // Floating icon content
      floatingIconContent: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        color: '#ffffff',
      },

      // Play icon
      playIcon: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: '#ffffff',
        marginLeft: '2px',
      },

      // Chrome icon
      chromeIcon: {
        fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        color: '#ffffff',
        fontWeight: 'bold',
      },

      // Dashboard card
      dashboardCard: {
        position: 'absolute',
        top: 'clamp(20%, 25%, 30%)',
        right: 'clamp(5%, 10%, 15%)',
        width: 'clamp(16rem, 25vw, 17.5rem)',
        height: 'clamp(10rem, 18vw, 12.5rem)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '@media (max-width: 1400px)': {
          width: 'clamp(14rem, 22vw, 16rem)',
          height: 'clamp(9rem, 16vw, 11rem)',
        },
        '@media (max-width: 1200px)': {
          width: 'clamp(12rem, 20vw, 14rem)',
          height: 'clamp(8rem, 14vw, 10rem)',
        },
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
        backgroundColor: '#e5e7eb',
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
        backgroundColor: '#f3f4f6',
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
        backgroundColor: '#e5e7eb',
        borderRadius: 'clamp(0.125rem, 0.5vw, 0.25rem)',
        width: '100%',
      },

      // Card line short
      cardLineShort: {
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
        backgroundColor: '#f3f4f6',
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

      // Promo title
      promoTitle: {
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        lineHeight: '1.1',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '@media (max-width: 1400px)': {
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        },
        '@media (max-width: 1200px)': {
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
        },
      },

      // Promo subtitle
      promoSubtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
        lineHeight: '1.6',
        maxWidth: '100%',
        '@media (max-width: 1400px)': {
          fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
        },
        '@media (max-width: 1200px)': {
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
        },
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
        backgroundColor: '#ffffff',
      },

      // Inactive dot
      inactiveDot: {
        width: 'clamp(0.375rem, 1vw, 0.5rem)',
        height: 'clamp(0.375rem, 1vw, 0.5rem)',
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
        padding: 'clamp(1rem, 4vw, 1.25rem)',
        minHeight: '100vh',
      },

      // Mobile form container
      mobileFormContainer: {
        width: '100%',
        maxWidth: 'min(25rem, 95vw)',
      },

      // Mobile logo
      mobileLogo: {
        textAlign: 'center',
        marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
      },

      // Mobile form content
      mobileFormContent: {
        width: '100%',
      },

      // Mobile title
      mobileTitle: {
        fontSize: 'clamp(1.5rem, 5vw, 1.75rem)',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
        textAlign: 'center',
        lineHeight: '1.2',
      },

      // Mobile subtitle
      mobileSubtitle: {
        fontSize: 'clamp(0.875rem, 3vw, 1rem)',
        color: '#6b7280',
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

      // Slide main icon
      slideMainIcon: {
        width: 'clamp(6rem, 12vw, 7.5rem)',
        height: 'clamp(6rem, 12vw, 7.5rem)',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        color: '#ffffff',
        '@media (max-width: 1400px)': {
          width: 'clamp(5rem, 10vw, 6.5rem)',
          height: 'clamp(5rem, 10vw, 6.5rem)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        },
        '@media (max-width: 1200px)': {
          width: 'clamp(4.5rem, 9vw, 6rem)',
          height: 'clamp(4.5rem, 9vw, 6rem)',
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
        },
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

      // Feature icon
      featureIcon: {
        position: 'absolute',
        width: 'clamp(2rem, 4vw, 2.5rem)',
        height: 'clamp(2rem, 4vw, 2.5rem)',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
        color: '#ffffff',
        '&:nth-child(1)': {
          top: 'clamp(0.5rem, 1vw, 0.625rem)',
          right: 'clamp(1rem, 2vw, 1.25rem)',
          animationDelay: '0s',
        },
        '&:nth-child(2)': {
          bottom: 'clamp(1rem, 2vw, 1.25rem)',
          left: 'clamp(0.5rem, 1vw, 0.625rem)',
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
        maxWidth: '100%',
        margin: '0 auto',
      },

      // Slide title
      slideTitle: {
        fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        lineHeight: '1.2',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '@media (max-width: 1400px)': {
          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
        },
        '@media (max-width: 1200px)': {
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
        },
      },

      // Slide description
      slideDescription: {
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: '1.6',
        marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
        '@media (max-width: 1400px)': {
          fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        },
        '@media (max-width: 1200px)': {
          fontSize: 'clamp(0.75rem, 1.25vw, 0.85rem)',
        },
      },

      // Learn more button
      learnMoreButton: {
        color: '#ffffff',
        fontSize: 'clamp(0.875rem, 1.75vw, 1rem)',
        fontWeight: '500',
        padding: 'clamp(0.25rem, 1vw, 0.5rem) 0',
        height: 'auto',
        textDecoration: 'underline',
        '&:hover': {
          color: 'rgba(255, 255, 255, 0.8)',
          textDecoration: 'underline',
        },
      },
    }),
    [token]
  );
};

// Custom CSS for Ant Design Carousel
export const carouselCustomCSS = `
  /* Floating animation keyframes */
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

  /* Breathing animation for icons */
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
