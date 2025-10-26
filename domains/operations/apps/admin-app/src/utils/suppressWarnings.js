/**
 * Utility to suppress specific React warnings in development mode
 * This is specifically designed to handle known Ant Design findDOMNode warnings
 * while preserving other important warnings and maintaining StrictMode benefits
 */

// Store the original console.error function
const originalError = console.error;

/**
 * Suppress findDOMNode warnings from Ant Design components
 * This is a temporary solution until Ant Design fully migrates away from findDOMNode
 */
export const suppressFindDOMNodeWarnings = () => {
  // Only suppress warnings in development mode
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.error = (...args) => {
    // Check if this is a findDOMNode warning
    const message = args[0];
    
    // Handle both string messages and formatted warning messages
    const isStringMessage = typeof message === 'string';
    const messageText = isStringMessage ? message : String(message);
    
    // Check for various findDOMNode warning patterns
    const isFindDOMNodeWarning = (
      messageText.includes('findDOMNode is deprecated in StrictMode') ||
      messageText.includes('findDOMNode was passed an instance of DomWrapper') ||
      messageText.includes('findDOMNode is deprecated and will be removed') ||
      (messageText.includes('findDOMNode') && messageText.includes('DomWrapper')) ||
      (messageText.includes('findDOMNode') && messageText.includes('deprecated')) ||
      (args.length > 1 && String(args[1]).includes('findDOMNode')) ||
      (args.length > 2 && String(args[2]).includes('DomWrapper')) ||
      (args.length > 2 && String(args[2]).includes('deprecated'))
    );
    
    if (isFindDOMNodeWarning) {
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
      '%c[Warning Suppression] %cAnt Design findDOMNode warnings are being suppressed in development mode.',
      'color: #1890ff; font-weight: bold;',
      'color: #666;'
    );
  }
};