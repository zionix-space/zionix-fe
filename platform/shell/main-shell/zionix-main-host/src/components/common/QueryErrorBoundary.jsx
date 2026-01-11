/**
 * @fileoverview Query Error Boundary Component
 * 
 * Specialized error boundary for React Query errors.
 * Provides retry functionality and better error messages for API failures.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import { Button, Result, Alert } from 'antd';
import {
    errorContainerStyles,
    errorContentStyles,
    errorCardStyles,
    iconContainerStyles,
    iconStyles,
    titleStyles,
    messageStyles,
    buttonContainerStyles,
    primaryButtonStyles,
    secondaryButtonStyles,
    devErrorAlertStyles,
    devAlertStyles,
    devAlertDescriptionStyles
} from './QueryErrorBoundary.style';

/**
 * Query Error Fallback Component
 * Displays user-friendly error messages for API failures
 */
export const QueryErrorFallback = ({ error, resetErrorBoundary }) => {
    // Determine error type and message
    const getErrorInfo = () => {
        if (error?.isNetworkError) {
            return {
                icon: '⚠️',
                title: 'Network Connection Issue',
                message: 'Unable to connect to the server. Please check your internet connection.',
            };
        }

        if (error?.status === 429) {
            return {
                icon: '⏱️',
                title: 'Too Many Requests',
                message: `Please wait ${error.retryAfter || 'a few'} seconds before trying again.`,
            };
        }

        if (error?.isServerError) {
            return {
                icon: '🔧',
                title: 'Server Error',
                message: 'Our servers are experiencing issues. Please try again in a moment.',
            };
        }

        if (error?.status === 403) {
            return {
                icon: '🔒',
                title: 'Access Denied',
                message: 'You don\'t have permission to access this resource.',
            };
        }

        if (error?.status === 404) {
            return {
                icon: '🔍',
                title: 'Not Found',
                message: 'The requested resource could not be found.',
            };
        }

        // Default error
        return {
            icon: '⚠️',
            title: 'Something Went Wrong',
            message: error?.message || 'An unexpected error occurred. Please try again.',
        };
    };

    const errorInfo = getErrorInfo();

    return (
        <div style={errorContainerStyles}>
            <div style={errorContentStyles}>
                <div style={errorCardStyles}>
                    {/* Icon */}
                    <div style={iconContainerStyles}>
                        <span style={iconStyles}>{errorInfo.icon}</span>
                    </div>

                    {/* Title */}
                    <h1 style={titleStyles}>{errorInfo.title}</h1>

                    {/* Message */}
                    <p style={messageStyles}>{errorInfo.message}</p>

                    {/* Buttons */}
                    <div style={buttonContainerStyles}>
                        <Button
                            type="primary"
                            onClick={resetErrorBoundary}
                            style={primaryButtonStyles}
                        >
                            Try Again
                        </Button>
                        <Button
                            onClick={() => (window.location.href = '/')}
                            style={secondaryButtonStyles}
                        >
                            Go Home
                        </Button>
                    </div>

                    {/* Development Error Details */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <div style={devErrorAlertStyles}>
                            <Alert
                                message="Development Error Details"
                                description={
                                    <div style={devAlertDescriptionStyles}>
                                        <div><strong>Status:</strong> {error.status || 'N/A'}</div>
                                        <div><strong>Message:</strong> {error.message}</div>
                                        {error.code && (
                                            <div><strong>Code:</strong> {error.code}</div>
                                        )}
                                    </div>
                                }
                                type="info"
                                closable
                                style={devAlertStyles}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QueryErrorFallback;
