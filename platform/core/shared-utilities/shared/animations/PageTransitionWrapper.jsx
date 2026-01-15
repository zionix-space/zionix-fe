/**
 * @fileoverview Page Transition Wrapper Component
 * 
 * Reusable wrapper component for consistent page transitions across all remote apps.
 * Automatically applies smooth animations to page content.
 * 
 * @author Zionix Platform Team
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransitionVariants } from './pageTransitions';

/**
 * PageTransitionWrapper - Wraps page content with smooth transition animations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to animate
 * @param {Object} [props.variants] - Custom animation variants (optional)
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 * @param {string} [props.transitionKey] - Unique key for AnimatePresence (optional)
 * 
 * @example
 * // Basic usage
 * <PageTransitionWrapper>
 *   <YourPageContent />
 * </PageTransitionWrapper>
 * 
 * @example
 * // With custom variants
 * <PageTransitionWrapper variants={customVariants}>
 *   <YourPageContent />
 * </PageTransitionWrapper>
 */
export const PageTransitionWrapper = ({
    children,
    variants = pageTransitionVariants,
    className = '',
    style = {},
    transitionKey,
    ...rest
}) => {
    return (
        <motion.div
            key={transitionKey}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
            style={{
                width: '100%',
                height: '100%',
                ...style,
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default PageTransitionWrapper;
