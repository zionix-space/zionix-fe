/**
 * @fileoverview Error Boundary Component
 * 
 * React Error Boundary for catching and handling component errors gracefully.
 * Provides fallback UI and error reporting capabilities.
 * Handles rendering errors, data transformation issues, and unexpected exceptions.
 * 
 * @author Zionix Platform Team
 * @version 2.0.0
 */

import React from 'react';
import { BaseButton as Button, useTheme } from '@zionix-space/design-system';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Provides user-friendly error messages and recovery options
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorType: 'unknown',
        };
    }

    static getDerivedStateFromError(error) {
        // Classify error type for better user messaging
        let errorType = 'unknown';
        const errorMessage = error?.message || error?.toString() || '';

        if (errorMessage.includes('Objects are not valid as a React child')) {
            errorType = 'rendering';
        } else if (errorMessage.includes('Cannot read properties of undefined')) {
            errorType = 'data';
        } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
            errorType = 'network';
        } else if (errorMessage.includes('ChunkLoadError') || errorMessage.includes('Loading chunk')) {
            errorType = 'chunk';
        }

        // Update state so the next render will show the fallback UI
        return { hasError: true, errorType };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Error Boundary Caught an Error');
            console.error('Error:', error);
            console.error('Error Info:', errorInfo);
            console.error('Component Stack:', errorInfo?.componentStack);
            console.groupEnd();
        }

        // Store error details
        this.setState({
            error,
            errorInfo,
        });

        // Log to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.logErrorToService(error, errorInfo);
        }
    }

    logErrorToService = (error, errorInfo) => {
        // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
        // Example:
        // Sentry.captureException(error, {
        //   contexts: {
        //     react: {
        //       componentStack: errorInfo?.componentStack,
        //     },
        //   },
        // });

        // For now, log to console in a structured way
        console.error('Error logged for monitoring:', {
            message: error?.message,
            stack: error?.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        });
    };

    getUserFriendlyMessage = () => {
        const { errorType, error } = this.state;

        switch (errorType) {
            case 'rendering':
                return {
                    title: 'Display Error',
                    subtitle: 'We encountered an issue displaying some data. This might be due to an unexpected data format from the server.',
                    suggestion: 'Please try refreshing the page. If the problem persists, contact support.',
                };
            case 'data':
                return {
                    title: 'Data Error',
                    subtitle: 'Some required data is missing or in an unexpected format.',
                    suggestion: 'Please try refreshing the page or logging out and back in.',
                };
            case 'network':
                return {
                    title: 'Connection Error',
                    subtitle: 'We\'re having trouble connecting to the server.',
                    suggestion: 'Please check your internet connection and try again.',
                };
            case 'chunk':
                return {
                    title: 'Loading Error',
                    subtitle: 'Failed to load a required component. This might be due to a recent update.',
                    suggestion: 'Please refresh the page to load the latest version.',
                };
            default:
                return {
                    title: 'Something Went Wrong',
                    subtitle: 'An unexpected error occurred while processing your request.',
                    suggestion: 'Please try refreshing the page. If the issue continues, contact support.',
                };
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorType: 'unknown',
        });

        // Call optional onReset callback
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleReload = () => {
        // Clear any cached data that might be causing issues
        if (this.state.errorType === 'rendering' || this.state.errorType === 'data') {
            // Clear React Query cache
            try {
                window.location.reload(true); // Force reload from server
            } catch (e) {
                window.location.reload();
            }
        } else {
            window.location.reload();
        }
    };

    handleLogout = () => {
        // Clear auth and reload
        try {
            localStorage.removeItem('zionix_access_token');
            localStorage.removeItem('zionix_refresh_token');
            localStorage.removeItem('zionix_session_id');
            localStorage.removeItem('zionix_user_data');
            localStorage.removeItem('auth-store');
            window.location.href = '/';
        } catch (e) {
            window.location.href = '/';
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { title, subtitle, suggestion } = this.getUserFriendlyMessage();
            const { errorType } = this.state;

            // Get theme from localStorage for error page
            const isDarkMode = typeof window !== 'undefined'
                ? localStorage.getItem('zionix-theme-mode') === 'dark'
                : false;

            // Apple-inspired premium error UI
            return (
                <ErrorFallbackUI
                    title={title}
                    subtitle={subtitle}
                    suggestion={suggestion}
                    errorType={errorType}
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReload={this.handleReload}
                    onLogout={this.handleLogout}
                    onReset={this.handleReset}
                    isDarkMode={isDarkMode}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Premium Error Fallback UI Component
 * Apple-inspired design with glassmorphism and smooth animations
 */
const ErrorFallbackUI = ({
    title,
    subtitle,
    suggestion,
    errorType,
    error,
    errorInfo,
    onReload,
    onLogout,
    onReset,
    isDarkMode
}) => {
    const [showDetails, setShowDetails] = React.useState(false);

    // Theme-aware colors
    const bgColor = isDarkMode ? '#000000' : '#ffffff';
    const cardBg = isDarkMode
        ? 'rgba(28, 28, 30, 0.8)'
        : 'rgba(255, 255, 255, 0.8)';
    const textPrimary = isDarkMode ? '#ffffff' : '#1d1d1f';
    const textSecondary = isDarkMode ? '#98989d' : '#6e6e73';
    const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const errorColor = '#ff3b30';
    const primaryColor = localStorage.getItem('zionix-theme-primary-color') || '#001968';

    const styles = {
        container: {
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(16px, 5vw, 40px)',
            background: bgColor,
            overflow: 'auto',
        },
        card: {
            width: '100%',
            maxWidth: 'min(600px, 100%)',
            background: cardBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'clamp(16px, 3vw, 24px)',
            padding: 'clamp(24px, 6vw, 48px)',
            boxShadow: isDarkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
            animation: 'errorSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        iconContainer: {
            width: 'clamp(64px, 15vw, 80px)',
            height: 'clamp(64px, 15vw, 80px)',
            margin: '0 auto clamp(20px, 4vw, 32px)',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${errorColor}15, ${errorColor}05)`,
            border: `2px solid ${errorColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'errorPulse 2s ease-in-out infinite',
        },
        icon: {
            fontSize: 'clamp(32px, 8vw, 40px)',
            color: errorColor,
        },
        title: {
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 600,
            color: textPrimary,
            marginBottom: 'clamp(12px, 3vw, 16px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
        },
        subtitle: {
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: textSecondary,
            marginBottom: 'clamp(8px, 2vw, 12px)',
            lineHeight: 1.5,
        },
        suggestion: {
            fontSize: 'clamp(13px, 3vw, 14px)',
            color: textSecondary,
            marginBottom: 'clamp(24px, 5vw, 32px)',
            lineHeight: 1.6,
            opacity: 0.8,
        },
        buttonGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(10px, 2.5vw, 12px)',
            marginBottom: 'clamp(16px, 4vw, 24px)',
        },
        primaryButton: {
            width: '100%',
            height: 'clamp(44px, 10vw, 48px)',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            fontWeight: 500,
            borderRadius: 'clamp(10px, 2.5vw, 12px)',
            border: 'none',
            background: primaryColor,
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 2px 8px ${primaryColor}30`,
        },
        secondaryButton: {
            width: '100%',
            height: 'clamp(44px, 10vw, 48px)',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            fontWeight: 500,
            borderRadius: 'clamp(10px, 2.5vw, 12px)',
            border: `1px solid ${borderColor}`,
            background: 'transparent',
            color: textPrimary,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        detailsToggle: {
            fontSize: 'clamp(12px, 3vw, 13px)',
            color: textSecondary,
            cursor: 'pointer',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            padding: '8px',
            marginTop: 'clamp(8px, 2vw, 12px)',
        },
        detailsContainer: {
            marginTop: 'clamp(16px, 4vw, 24px)',
            padding: 'clamp(16px, 4vw, 20px)',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.03)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'clamp(8px, 2vw, 12px)',
            textAlign: 'left',
            maxHeight: '40vh',
            overflow: 'auto',
        },
        detailsTitle: {
            fontSize: 'clamp(12px, 3vw, 13px)',
            fontWeight: 600,
            color: errorColor,
            marginBottom: 'clamp(8px, 2vw, 12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        detailsSection: {
            marginBottom: 'clamp(12px, 3vw, 16px)',
            padding: 'clamp(10px, 2.5vw, 12px)',
            background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
        },
        detailsLabel: {
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            fontWeight: 600,
            color: textPrimary,
            marginBottom: '6px',
        },
        detailsContent: {
            fontSize: 'clamp(10px, 2.5vw, 11px)',
            fontFamily: 'SF Mono, Monaco, Consolas, monospace',
            color: textSecondary,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.5,
            maxHeight: '150px',
            overflow: 'auto',
        },
    };

    const keyframes = `
        @keyframes errorSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        @keyframes errorPulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.8;
            }
        }
    `;

    return (
        <div style={styles.container}>
            <style>{keyframes}</style>
            <div style={styles.card}>
                {/* Error Icon */}
                <div style={styles.iconContainer}>
                    <i className="ri-error-warning-line" style={styles.icon} />
                </div>

                {/* Title */}
                <h1 style={styles.title}>{title}</h1>

                {/* Subtitle */}
                <p style={styles.subtitle}>{subtitle}</p>

                {/* Suggestion */}
                <p style={styles.suggestion}>{suggestion}</p>

                {/* Action Buttons */}
                <div style={styles.buttonGroup}>
                    <button
                        style={styles.primaryButton}
                        onClick={onReload}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = `0 4px 12px ${primaryColor}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 2px 8px ${primaryColor}30`;
                        }}
                    >
                        <i className="ri-refresh-line" style={{ marginRight: '8px' }} />
                        Reload Page
                    </button>

                    {(errorType === 'rendering' || errorType === 'data') ? (
                        <button
                            style={styles.secondaryButton}
                            onClick={onLogout}
                            onMouseEnter={(e) => {
                                e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            <i className="ri-logout-box-line" style={{ marginRight: '8px' }} />
                            Logout & Clear Data
                        </button>
                    ) : (
                        <button
                            style={styles.secondaryButton}
                            onClick={onReset}
                            onMouseEnter={(e) => {
                                e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            <i className="ri-arrow-go-back-line" style={{ marginRight: '8px' }} />
                            Try Again
                        </button>
                    )}
                </div>

                {/* Developer Details Toggle */}
                {process.env.NODE_ENV === 'development' && error && (
                    <>
                        <button
                            style={styles.detailsToggle}
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? '▼' : '▶'} {showDetails ? 'Hide' : 'Show'} Error Details
                        </button>

                        {showDetails && (
                            <div style={styles.detailsContainer}>
                                <div style={styles.detailsTitle}>
                                    <i className="ri-bug-line" />
                                    Development Error Details
                                </div>

                                <div style={styles.detailsSection}>
                                    <div style={styles.detailsLabel}>Error Type</div>
                                    <div style={styles.detailsContent}>{errorType}</div>
                                </div>

                                <div style={styles.detailsSection}>
                                    <div style={styles.detailsLabel}>Error Message</div>
                                    <div style={styles.detailsContent}>{error.toString()}</div>
                                </div>

                                {error.stack && (
                                    <div style={styles.detailsSection}>
                                        <div style={styles.detailsLabel}>Stack Trace</div>
                                        <div style={styles.detailsContent}>{error.stack}</div>
                                    </div>
                                )}

                                {errorInfo?.componentStack && (
                                    <div style={styles.detailsSection}>
                                        <div style={styles.detailsLabel}>Component Stack</div>
                                        <div style={styles.detailsContent}>{errorInfo.componentStack}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary;
