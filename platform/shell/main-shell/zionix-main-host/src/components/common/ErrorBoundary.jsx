/**
 * @fileoverview Error Boundary Component
 * 
 * React Error Boundary for catching and handling component errors gracefully.
 * Provides fallback UI and error reporting capabilities.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import React from 'react';
import { BaseButton as Button, BaseResult as Result } from '@zionix-space/design-system';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error Boundary caught an error:', error, errorInfo);
        }

        // Store error details
        this.setState({
            error,
            errorInfo,
        });

        // TODO: Send error to monitoring service (Sentry, LogRocket, etc.)
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        // Call optional onReset callback
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        padding: '24px',
                    }}
                >
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="We're sorry for the inconvenience. Please try refreshing the page."
                        extra={[
                            <Button type="primary" key="reset" onClick={this.handleReset}>
                                Try Again
                            </Button>,
                            <Button key="reload" onClick={() => window.location.reload()}>
                                Reload Page
                            </Button>,
                        ]}
                    >
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div
                                style={{
                                    marginTop: '24px',
                                    padding: '16px',
                                    background: '#f5f5f5',
                                    borderRadius: '4px',
                                    textAlign: 'left',
                                    maxWidth: '600px',
                                }}
                            >
                                <details style={{ whiteSpace: 'pre-wrap' }}>
                                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        Error Details (Development Only)
                                    </summary>
                                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                        <strong>Error:</strong> {this.state.error.toString()}
                                        <br />
                                        <br />
                                        <strong>Stack Trace:</strong>
                                        <pre style={{ fontSize: '11px', overflow: 'auto' }}>
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </div>
                                </details>
                            </div>
                        )}
                    </Result>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
