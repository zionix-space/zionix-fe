/**
 * @fileoverview Query Error Boundary Component
 * 
 * Specialized error boundary for React Query errors.
 * Provides retry functionality and better error messages for API failures.
 * Apple-inspired premium design with full responsiveness.
 * 
 * @author Zionix Platform Team
 * @version 2.0.0
 */

import React from 'react';

/**
 * Query Error Fallback Component
 * Displays user-friendly error messages for API failures
 */
export const QueryErrorFallback = ({ error, resetErrorBoundary }) => {
    const [showDetails, setShowDetails] = React.useState(false);

    // Get theme from localStorage
    const isDarkMode = typeof window !== 'undefined'
        ? localStorage.getItem('zionix-theme-mode') === 'dark'
        : false;
    const primaryColor = typeof window !== 'undefined'
        ? localStorage.getItem('zionix-theme-primary-color') || '#001968'
        : '#001968';

    // Determine error type and message
    const getErrorInfo = () => {
        if (error?.isNetworkError) {
            return {
                icon: 'ri-wifi-off-line',
                title: 'Network Connection Issue',
                message: 'Unable to connect to the server. Please check your internet connection.',
                color: '#ff9500',
            };
        }

        if (error?.status === 429) {
            return {
                icon: 'ri-time-line',
                title: 'Too Many Requests',
                message: `Please wait ${error.retryAfter || 'a few'} seconds before trying again.`,
                color: '#ff9500',
            };
        }

        if (error?.isServerError) {
            return {
                icon: 'ri-tools-line',
                title: 'Server Error',
                message: 'Our servers are experiencing issues. Please try again in a moment.',
                color: '#ff3b30',
            };
        }

        if (error?.status === 403) {
            return {
                icon: 'ri-lock-line',
                title: 'Access Denied',
                message: 'You don\'t have permission to access this resource.',
                color: '#ff3b30',
            };
        }

        if (error?.status === 404) {
            return {
                icon: 'ri-search-line',
                title: 'Not Found',
                message: 'The requested resource could not be found.',
                color: '#ff9500',
            };
        }

        // Default error
        return {
            icon: 'ri-error-warning-line',
            title: 'Something Went Wrong',
            message: error?.message || 'An unexpected error occurred. Please try again.',
            color: '#ff3b30',
        };
    };

    const errorInfo = getErrorInfo();

    // Theme-aware colors
    const bgColor = isDarkMode ? '#000000' : '#ffffff';
    const cardBg = isDarkMode
        ? 'rgba(28, 28, 30, 0.8)'
        : 'rgba(255, 255, 255, 0.8)';
    const textPrimary = isDarkMode ? '#ffffff' : '#1d1d1f';
    const textSecondary = isDarkMode ? '#98989d' : '#6e6e73';
    const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

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
            zIndex: 9999,
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
            animation: 'queryErrorSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        },
        iconContainer: {
            width: 'clamp(64px, 15vw, 80px)',
            height: 'clamp(64px, 15vw, 80px)',
            margin: '0 auto clamp(20px, 4vw, 32px)',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${errorInfo.color}15, ${errorInfo.color}05)`,
            border: `2px solid ${errorInfo.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'queryErrorPulse 2s ease-in-out infinite',
        },
        icon: {
            fontSize: 'clamp(32px, 8vw, 40px)',
            color: errorInfo.color,
        },
        title: {
            fontSize: 'clamp(20px, 5vw, 28px)',
            fontWeight: 600,
            color: textPrimary,
            marginBottom: 'clamp(12px, 3vw, 16px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
        },
        message: {
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: textSecondary,
            marginBottom: 'clamp(24px, 5vw, 32px)',
            lineHeight: 1.6,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
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
        },
        detailsTitle: {
            fontSize: 'clamp(12px, 3vw, 13px)',
            fontWeight: 600,
            color: errorInfo.color,
            marginBottom: 'clamp(8px, 2vw, 12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        detailsRow: {
            fontSize: 'clamp(11px, 2.5vw, 12px)',
            color: textSecondary,
            marginBottom: '6px',
            wordBreak: 'break-word',
        },
        detailsLabel: {
            fontWeight: 600,
            color: textPrimary,
        },
    };

    const keyframes = `
        @keyframes queryErrorSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        @keyframes queryErrorPulse {
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
                    <i className={errorInfo.icon} style={styles.icon} />
                </div>

                {/* Title */}
                <h1 style={styles.title}>{errorInfo.title}</h1>

                {/* Message */}
                <p style={styles.message}>{errorInfo.message}</p>

                {/* Action Buttons */}
                <div style={styles.buttonGroup}>
                    <button
                        style={styles.primaryButton}
                        onClick={resetErrorBoundary}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = `0 4px 12px ${primaryColor}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = `0 2px 8px ${primaryColor}30`;
                        }}
                    >
                        <i className="ri-refresh-line" />
                        Try Again
                    </button>

                    <button
                        style={styles.secondaryButton}
                        onClick={() => (window.location.href = '/')}
                        onMouseEnter={(e) => {
                            e.target.style.background = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                        }}
                    >
                        <i className="ri-home-line" />
                        Go Home
                    </button>
                </div>

                {/* Development Error Details */}
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

                                {error.status && (
                                    <div style={styles.detailsRow}>
                                        <span style={styles.detailsLabel}>Status:</span> {error.status}
                                    </div>
                                )}

                                <div style={styles.detailsRow}>
                                    <span style={styles.detailsLabel}>Message:</span> {error.message}
                                </div>

                                {error.code && (
                                    <div style={styles.detailsRow}>
                                        <span style={styles.detailsLabel}>Code:</span> {error.code}
                                    </div>
                                )}

                                {error.url && (
                                    <div style={styles.detailsRow}>
                                        <span style={styles.detailsLabel}>URL:</span> {error.url}
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

export default QueryErrorFallback;
