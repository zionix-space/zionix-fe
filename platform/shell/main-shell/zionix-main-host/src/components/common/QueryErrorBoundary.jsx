/**
 * @fileoverview Query Error Boundary Component
 * 
 * Specialized error boundary for React Query errors.
 * Provides retry functionality and better error messages for API failures.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import React from 'react';
import { Button, Result, Alert } from 'antd';

/**
 * Query Error Fallback Component
 * Displays user-friendly error messages for API failures
 */
export const QueryErrorFallback = ({ error, resetErrorBoundary }) => {
    // Determine error type and message
    const getErrorInfo = () => {
        if (error?.isNetworkError) {
            return {
                status: 'warning',
                title: 'Network Connection Issue',
                message: 'Unable to connect to the server. Please check your internet connection.',
            };
        }

        if (error?.status === 429) {
            return {
                status: 'warning',
                title: 'Too Many Requests',
                message: `Please wait ${error.retryAfter || 'a few'} seconds before trying again.`,
            };
        }

        if (error?.isServerError) {
            return {
                status: 'error',
                title: 'Server Error',
                message: 'Our servers are experiencing issues. Please try again in a moment.',
            };
        }

        if (error?.status === 403) {
            return {
                status: 'warning',
                title: 'Access Denied',
                message: 'You don\'t have permission to access this resource.',
            };
        }

        if (error?.status === 404) {
            return {
                status: '404',
                title: 'Not Found',
                message: 'The requested resource could not be found.',
            };
        }

        // Default error
        return {
            status: 'error',
            title: 'Something Went Wrong',
            message: error?.message || 'An unexpected error occurred. Please try again.',
        };
    };

    const errorInfo = getErrorInfo();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                padding: '24px',
            }}
        >
            <Result
                status={errorInfo.status}
                title={errorInfo.title}
                subTitle={errorInfo.message}
                extra={[
                    <Button type="primary" key="retry" onClick={resetErrorBoundary}>
                        Try Again
                    </Button>,
                    <Button key="home" onClick={() => (window.location.href = '/')}>
                        Go Home
                    </Button>,
                ]}
            >
                {process.env.NODE_ENV === 'development' && error && (
                    <Alert
                        message="Development Error Details"
                        description={
                            <div style={{ textAlign: 'left', fontSize: '12px' }}>
                                <strong>Status:</strong> {error.status || 'N/A'}
                                <br />
                                <strong>Message:</strong> {error.message}
                                <br />
                                {error.code && (
                                    <>
                                        <strong>Code:</strong> {error.code}
                                        <br />
                                    </>
                                )}
                            </div>
                        }
                        type="info"
                        closable
                        style={{ marginTop: '16px', maxWidth: '500px' }}
                    />
                )}
            </Result>
        </div>
    );
};

export default QueryErrorFallback;
