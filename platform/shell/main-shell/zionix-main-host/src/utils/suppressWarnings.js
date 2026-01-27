/**
 * Utility to suppress specific React warnings in development mode
 * This is specifically designed to handle known Ant Design findDOMNode warnings
 * while preserving other important warnings and maintaining StrictMode benefits
 */

// Store the original console.error function
const originalError = console.error;

/**
 * Suppress known Ant Design warnings
 * This is a temporary solution until Ant Design fully updates
 */
export const suppressFindDOMNodeWarnings = () => {
  // Only suppress warnings in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.error = (...args) => {
    // Check if this is a warning we want to suppress
    const message = args[0];

    // Handle both string messages and formatted warning messages
    const isStringMessage = typeof message === 'string';
    const messageText = isStringMessage ? message : String(message);

    // Check for various warning patterns to suppress
    const shouldSuppress = (
      // findDOMNode warnings
      messageText.includes('findDOMNode is deprecated in StrictMode') ||
      messageText.includes('findDOMNode was passed an instance of DomWrapper') ||
      messageText.includes('findDOMNode is deprecated and will be removed') ||
      (messageText.includes('findDOMNode') && messageText.includes('DomWrapper')) ||
      (messageText.includes('findDOMNode') && messageText.includes('deprecated')) ||
      (args.length > 1 && String(args[1]).includes('findDOMNode')) ||
      (args.length > 2 && String(args[2]).includes('DomWrapper')) ||
      (args.length > 2 && String(args[2]).includes('deprecated')) ||

      // Ant Design deprecation warnings
      messageText.includes('dropdownRender') && messageText.includes('deprecated') ||
      messageText.includes('Please use `popupRender` instead') ||
      messageText.includes('Function components cannot be given refs') ||
      messageText.includes('React.forwardRef') ||
      messageText.includes('The `List` component is deprecated') ||
      messageText.includes('will be removed in next major version') ||
      messageText.includes('overlayInnerStyle') && messageText.includes('deprecated') ||
      messageText.includes('Please use `styles.container` instead')
    );

    if (shouldSuppress) {
      // Suppress this specific warning
      return;
    }

    // For all other errors/warnings, use the original console.error
    originalError.apply(console, args);
  };
};

/**
 * Restore the original console.error function
 * Useful for testing or if you need to restore normal error handling
 */
export const restoreConsoleError = () => {
  console.error = originalError;
};

/**
 * Initialize warning suppression
 * Call this early in your application bootstrap
 */
export const initializeWarningSuppression = () => {
  suppressFindDOMNodeWarnings();

  // Optional: Log that warning suppression is active (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.info(
      '%c[Warning Suppression] %cKnown Ant Design warnings are being suppressed in development mode.',
      'color: #1890ff; font-weight: bold;',
      'color: #666;'
    );
  }
};